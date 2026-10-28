#!/usr/bin/env node
'use strict';

// Validates a launch-check-report.json against the rules in report-schema.json,
// plus cross-field checks the schema cannot express. No dependencies.
//
// Usage: node validate-report.cjs <report.json>
// Exit status: 0 = valid (warnings allowed), 1 = errors found, 2 = could not read input.

const fs = require('node:fs');

const SEVERITIES = ['critical', 'important', 'nice_to_have'];
const CATEGORIES = [
  'reachability', 'home', 'collections', 'product', 'checkout', 'policies',
  'notifications', 'seo', 'performance', 'accessibility', 'regional',
];
const TOP_LEVEL_KEYS = [
  'schema_version', 'store', 'checked_at', 'region', 'admin_access',
  'pages_checked', 'summary', 'findings', 'not_checked', 'confirm_yourself',
];
const FINDING_KEYS = [
  'id', 'severity', 'category', 'title', 'locations', 'problem', 'impact',
  'fix', 'evidence', 'rule',
];

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v) => typeof v === 'string' && v.trim().length > 0;
const isUrl = (v) => {
  if (typeof v !== 'string' || !/^https?:\/\//.test(v)) return false;
  try { new URL(v); return true; } catch { return false; }
};
const normaliseUrl = (v) => {
  const u = new URL(v);
  u.hash = '';
  let s = u.toString();
  if (s.endsWith('/')) s = s.slice(0, -1);
  return s.toLowerCase();
};
const isIsoDate = (v) => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};

function validateReport(report) {
  const errors = [];
  const warnings = [];
  const err = (path, msg) => errors.push(`${path}: ${msg}`);
  const warn = (path, msg) => warnings.push(`${path}: ${msg}`);

  if (!isObject(report)) {
    err('$', 'report must be a JSON object');
    return { errors, warnings };
  }

  for (const key of TOP_LEVEL_KEYS) {
    if (!(key in report)) err('$', `missing required field "${key}"`);
  }
  for (const key of Object.keys(report)) {
    if (!TOP_LEVEL_KEYS.includes(key)) err('$', `unexpected field "${key}"`);
  }

  if ('schema_version' in report && report.schema_version !== '1.0') {
    err('$.schema_version', 'must be "1.0"');
  }

  if ('store' in report) {
    if (!isObject(report.store)) err('$.store', 'must be an object');
    else {
      if (!isText(report.store.name)) err('$.store.name', 'must be a non-empty string');
      if (!isUrl(report.store.url)) err('$.store.url', 'must be an http(s) URL');
    }
  }

  if ('checked_at' in report && !isIsoDate(report.checked_at)) {
    err('$.checked_at', 'must be a real date in YYYY-MM-DD format');
  }

  if ('region' in report) {
    if (!Array.isArray(report.region) || report.region.length === 0) {
      err('$.region', 'must be a non-empty array');
    } else {
      report.region.forEach((r, i) => {
        if (typeof r !== 'string' || r.trim().length < 2) err(`$.region[${i}]`, 'must be a region code or name');
      });
    }
  }

  if ('admin_access' in report && typeof report.admin_access !== 'boolean') {
    err('$.admin_access', 'must be true or false');
  }

  const sample = new Set();
  if ('pages_checked' in report) {
    if (!Array.isArray(report.pages_checked) || report.pages_checked.length === 0) {
      err('$.pages_checked', 'must be a non-empty array');
    } else {
      report.pages_checked.forEach((p, i) => {
        if (!isUrl(p)) { err(`$.pages_checked[${i}]`, 'must be an http(s) URL'); return; }
        const n = normaliseUrl(p);
        if (sample.has(n)) err(`$.pages_checked[${i}]`, `duplicate page ${p}`);
        sample.add(n);
      });
    }
  }

  if ('summary' in report) {
    if (!isObject(report.summary)) err('$.summary', 'must be an object');
    else {
      if (typeof report.summary.ready_to_launch !== 'boolean') err('$.summary.ready_to_launch', 'must be true or false');
      if (!isText(report.summary.headline)) err('$.summary.headline', 'must be a non-empty string');
    }
  }

  const findings = Array.isArray(report.findings) ? report.findings : [];
  if ('findings' in report && !Array.isArray(report.findings)) err('$.findings', 'must be an array');

  const ids = new Set();
  let criticalCount = 0;
  let lastSeverityRank = -1;

  findings.forEach((f, i) => {
    const path = `$.findings[${i}]`;
    if (!isObject(f)) { err(path, 'must be an object'); return; }

    for (const key of Object.keys(f)) {
      if (!FINDING_KEYS.includes(key)) err(path, `unexpected field "${key}"`);
    }

    if (typeof f.id !== 'string' || !/^SLC-\d{3}$/.test(f.id)) err(`${path}.id`, 'must look like SLC-001');
    else if (ids.has(f.id)) err(`${path}.id`, `duplicate id ${f.id}`);
    else ids.add(f.id);

    const rank = SEVERITIES.indexOf(f.severity);
    if (rank === -1) err(`${path}.severity`, `must be one of ${SEVERITIES.join(', ')}`);
    else {
      if (rank < lastSeverityRank) warn(`${path}.severity`, 'findings are not ordered critical → important → nice_to_have');
      lastSeverityRank = Math.max(lastSeverityRank, rank);
      if (f.severity === 'critical') criticalCount += 1;
    }

    if (!CATEGORIES.includes(f.category)) err(`${path}.category`, `must be one of ${CATEGORIES.join(', ')}`);

    for (const key of ['title', 'problem', 'impact', 'fix']) {
      if (!isText(f[key])) err(`${path}.${key}`, 'must be a non-empty string');
    }

    if (!Array.isArray(f.locations) || f.locations.length === 0) {
      err(`${path}.locations`, 'must be a non-empty array');
    } else {
      f.locations.forEach((loc, j) => {
        const lpath = `${path}.locations[${j}]`;
        if (loc === 'admin') {
          if (report.admin_access === false && f.evidence && f.evidence.type === 'observed') {
            err(lpath, 'admin settings cannot be observed without admin access; move this item to confirm_yourself');
          }
          return;
        }
        if (!isUrl(loc)) { err(lpath, 'must be "admin" or an http(s) URL'); return; }
        if (sample.size > 0 && !sample.has(normaliseUrl(loc))) {
          warn(lpath, `${loc} is not in pages_checked`);
        }
      });
    }

    if (!isObject(f.evidence)) err(`${path}.evidence`, 'must be an object with type and detail');
    else {
      if (!['observed', 'inferred'].includes(f.evidence.type)) err(`${path}.evidence.type`, 'must be "observed" or "inferred"');
      if (!isText(f.evidence.detail)) err(`${path}.evidence.detail`, 'must be a non-empty string');
      if (f.severity === 'critical' && f.evidence.type === 'inferred') {
        warn(`${path}.evidence.type`, 'critical finding rests on inference; confirm it or lower the severity');
      }
    }

    if (f.category === 'regional' && !isText(f.rule)) err(`${path}.rule`, 'regional findings must name the rule they relate to');
    if ('rule' in f && !isText(f.rule)) err(`${path}.rule`, 'must be a non-empty string when present');
  });

  if (isObject(report.summary) && report.summary.ready_to_launch === true && criticalCount > 0) {
    err('$.summary.ready_to_launch', `cannot be true while there are ${criticalCount} critical finding(s)`);
  }

  for (const [key, field] of [['not_checked', 'reason'], ['confirm_yourself', 'why']]) {
    if (!(key in report)) continue;
    if (!Array.isArray(report[key])) { err(`$.${key}`, 'must be an array'); continue; }
    report[key].forEach((entry, i) => {
      const path = `$.${key}[${i}]`;
      if (!isObject(entry)) { err(path, 'must be an object'); return; }
      if (!isText(entry.item)) err(`${path}.item`, 'must be a non-empty string');
      if (!isText(entry[field])) err(`${path}.${field}`, 'must be a non-empty string');
      for (const k of Object.keys(entry)) {
        if (k !== 'item' && k !== field) err(path, `unexpected field "${k}"`);
      }
    });
  }

  if (report.admin_access === false && Array.isArray(report.confirm_yourself) && report.confirm_yourself.length === 0) {
    warn('$.confirm_yourself', 'no admin access but nothing listed for the user to confirm');
  }

  return { errors, warnings };
}

function main(argv) {
  const file = argv[2];
  if (!file) {
    console.error('Usage: node validate-report.cjs <launch-check-report.json>');
    return 2;
  }
  let report;
  try {
    report = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Could not read ${file}: ${e.message}`);
    return 2;
  }
  const { errors, warnings } = validateReport(report);
  for (const w of warnings) console.log(`warning  ${w}`);
  for (const e of errors) console.log(`error    ${e}`);
  const findings = Array.isArray(report.findings) ? report.findings.length : 0;
  console.log(`${errors.length} error(s), ${warnings.length} warning(s), ${findings} finding(s)`);
  return errors.length > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { validateReport };
