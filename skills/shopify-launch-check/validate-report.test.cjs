'use strict';

// Run with: node --test skills/shopify-launch-check/validate-report.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateReport } = require('./validate-report.cjs');

const base = () => ({
  schema_version: '1.0',
  store: { name: 'Example Sleep Co', url: 'https://example-sleep.com.au' },
  checked_at: '2026-10-28',
  region: ['AU'],
  admin_access: false,
  pages_checked: [
    'https://example-sleep.com.au/',
    'https://example-sleep.com.au/policies/refund-policy',
    'https://example-sleep.com.au/products/cloud-hybrid-queen',
  ],
  summary: { ready_to_launch: false, headline: 'Fix the refund policy wording before launch.' },
  findings: [
    {
      id: 'SLC-001',
      severity: 'critical',
      category: 'regional',
      title: 'Refund policy excludes sale items',
      locations: ['https://example-sleep.com.au/policies/refund-policy'],
      problem: 'The policy says sale items cannot be refunded.',
      impact: 'Consumer guarantees still apply to sale items.',
      fix: 'Limit the exclusion to change-of-mind returns.',
      evidence: { type: 'observed', detail: 'Policy text: "No refunds on sale items".' },
      rule: 'Australian Consumer Law — consumer guarantees',
    },
    {
      id: 'SLC-002',
      severity: 'important',
      category: 'product',
      title: 'Product images have no alt text',
      locations: ['https://example-sleep.com.au/products/cloud-hybrid-queen'],
      problem: 'None of the five product images has alt text.',
      impact: 'Hurts accessibility and image search.',
      fix: 'Add alt text to each image in the product editor.',
      evidence: { type: 'observed', detail: 'All img elements in the gallery have empty alt attributes.' },
    },
  ],
  not_checked: [{ item: 'Mobile layout', reason: 'No browser tool with resizing available.' }],
  confirm_yourself: [{ item: 'Place a test order', why: 'Checkout cannot be completed without admin access.' }],
});

test('a valid report passes with no errors or warnings', () => {
  const { errors, warnings } = validateReport(base());
  assert.deepEqual(errors, []);
  assert.deepEqual(warnings, []);
});

test('rejects a non-object report', () => {
  assert.equal(validateReport([]).errors.length, 1);
  assert.equal(validateReport(null).errors.length, 1);
});

test('reports missing and unexpected top-level fields', () => {
  const r = base();
  delete r.summary;
  r.extra = true;
  const { errors } = validateReport(r);
  assert.ok(errors.some((e) => e.includes('missing required field "summary"')));
  assert.ok(errors.some((e) => e.includes('unexpected field "extra"')));
});

test('rejects an impossible date', () => {
  const r = base();
  r.checked_at = '2026-02-30';
  assert.ok(validateReport(r).errors.some((e) => e.startsWith('$.checked_at')));
});

test('rejects an unknown severity and category', () => {
  const r = base();
  r.findings[1].severity = 'high';
  r.findings[1].category = 'misc';
  const { errors } = validateReport(r);
  assert.ok(errors.some((e) => e.startsWith('$.findings[1].severity')));
  assert.ok(errors.some((e) => e.startsWith('$.findings[1].category')));
});

test('rejects duplicate and malformed ids', () => {
  const r = base();
  r.findings[1].id = 'SLC-001';
  assert.ok(validateReport(r).errors.some((e) => e.includes('duplicate id SLC-001')));
  r.findings[1].id = 'finding-2';
  assert.ok(validateReport(r).errors.some((e) => e.startsWith('$.findings[1].id')));
});

test('regional findings must name a rule', () => {
  const r = base();
  delete r.findings[0].rule;
  assert.ok(validateReport(r).errors.some((e) => e.startsWith('$.findings[0].rule')));
});

test('ready_to_launch cannot be true with a critical finding', () => {
  const r = base();
  r.summary.ready_to_launch = true;
  assert.ok(validateReport(r).errors.some((e) => e.startsWith('$.summary.ready_to_launch')));
});

test('ready_to_launch may be true with no critical findings', () => {
  const r = base();
  r.findings = r.findings.slice(1);
  r.findings[0].id = 'SLC-001';
  r.summary.ready_to_launch = true;
  assert.deepEqual(validateReport(r).errors, []);
});

test('observed admin findings are rejected without admin access', () => {
  const r = base();
  r.findings[1].locations = ['admin'];
  assert.ok(validateReport(r).errors.some((e) => e.includes('cannot be observed without admin access')));
  r.admin_access = true;
  assert.deepEqual(validateReport(r).errors, []);
});

test('warns about locations outside the page sample, ignoring trailing slashes', () => {
  const r = base();
  r.findings[1].locations = ['https://example-sleep.com.au/products/other-mattress'];
  assert.ok(validateReport(r).warnings.some((w) => w.includes('is not in pages_checked')));
  r.findings[1].locations = ['https://example-sleep.com.au/products/cloud-hybrid-queen/'];
  assert.deepEqual(validateReport(r).warnings, []);
});

test('warns when a critical finding rests on inference', () => {
  const r = base();
  r.findings[0].evidence.type = 'inferred';
  const { errors, warnings } = validateReport(r);
  assert.deepEqual(errors, []);
  assert.ok(warnings.some((w) => w.includes('rests on inference')));
});

test('warns when findings are out of severity order', () => {
  const r = base();
  r.findings.reverse();
  r.findings[0].id = 'SLC-001';
  r.findings[1].id = 'SLC-002';
  assert.ok(validateReport(r).warnings.some((w) => w.includes('not ordered')));
});

test('checks not_checked and confirm_yourself entries', () => {
  const r = base();
  r.not_checked = [{ item: 'Mobile layout' }];
  r.confirm_yourself = [{ item: 'Tax setting', why: 'Admin only', note: 'x' }];
  const { errors } = validateReport(r);
  assert.ok(errors.some((e) => e.startsWith('$.not_checked[0].reason')));
  assert.ok(errors.some((e) => e.includes('unexpected field "note"')));
});

test('warns when there is no admin access and nothing to confirm', () => {
  const r = base();
  r.confirm_yourself = [];
  assert.ok(validateReport(r).warnings.some((w) => w.startsWith('$.confirm_yourself')));
});
