# Phase 3 — Grading and reporting

## Severity

| Level | JSON value | Meaning | Examples |
|---|---|---|---|
| Critical | `critical` | Blocks sales, breaks a law in the selling region, or loses customer trust immediately | Add to cart broken; prices shown without mandatory tax where a single total price is required; a returns policy saying there are no refunds; password page still on after launch |
| Important | `important` | Costs conversions or search traffic but does not stop a sale | Missing meta descriptions; product images without alt text; no shipping information before the cart; oversized hero image |
| Nice to have | `nice_to_have` | Polish | Generic favicon; inconsistent button wording; default 404 page |

When torn between two levels, choose the lower one and say why in the finding's `impact`.

`ready_to_launch` is `false` whenever there is at least one critical finding.

## Writing a finding

Each finding has:

- `id` — `SLC-001`, `SLC-002`, … in the order they appear in the report (critical first).
- `severity` and `category` (category names are given in brackets in the Phase 2 files).
- `title` — a few words.
- `locations` — URLs from `pages_checked`, or `admin` for settings only visible in Shopify admin.
- `problem` — what is wrong, in one sentence.
- `impact` — why it matters, in one sentence.
- `fix` — the concrete step, including where in Shopify admin if you know it.
- `evidence` — `type` is `observed` or `inferred`; `detail` says what you saw (quote at most a short phrase from the page).
- `rule` — required for `regional` findings: the law or guidance the finding relates to.

Without admin access, you cannot observe admin settings. Put those items in `confirm_yourself` instead of reporting them as findings.

## Markdown report — `launch-check-report.md`

Write it in the user's language.

```markdown
# Launch check: <store name>

Checked <YYYY-MM-DD> · <n> pages · Region: <region> · Admin access: yes/no

## Summary
<Two or three sentences: is the store ready to launch, and what is the single most important fix.>

## Critical (<count>)
1. **<Title>** — <location(s)>
   - Problem: …
   - Why it matters: …
   - Fix: …

## Important (<count>)
…

## Nice to have (<count>)
…

## Not checked
- <Item> — <reason>

## Please confirm yourself
- <Admin-side item> — <why it matters>
```

Keep each finding to three short lines. Omit a severity section only if its count is zero, and then write "None" under it instead of removing the heading.

## JSON report — `launch-check-report.json`

Same findings, in the shape defined by `report-schema.json`. Keys stay in English; text values may be in the user's language.

```json
{
  "schema_version": "1.0",
  "store": { "name": "Example Sleep Co", "url": "https://example-sleep.com.au" },
  "checked_at": "2026-10-28",
  "region": ["AU"],
  "admin_access": false,
  "pages_checked": ["https://example-sleep.com.au/", "https://example-sleep.com.au/policies/refund-policy"],
  "summary": { "ready_to_launch": false, "headline": "Fix the refund policy wording before launch." },
  "findings": [
    {
      "id": "SLC-001",
      "severity": "critical",
      "category": "regional",
      "title": "Refund policy excludes sale items",
      "locations": ["https://example-sleep.com.au/policies/refund-policy"],
      "problem": "The policy says sale items cannot be refunded.",
      "impact": "Consumer guarantees still apply to sale items, so this wording is generally unlawful.",
      "fix": "Limit the exclusion to change-of-mind returns.",
      "evidence": { "type": "observed", "detail": "Policy text: \"No refunds on sale items\"." },
      "rule": "Australian Consumer Law — consumer guarantees"
    }
  ],
  "not_checked": [{ "item": "Mobile layout", "reason": "No browser tool with resizing available." }],
  "confirm_yourself": [{ "item": "Place a test order", "why": "Checkout cannot be completed without admin access." }]
}
```

## Validate

```bash
node <skill-dir>/validate-report.cjs launch-check-report.json
```

Errors make the command exit with status 1; fix them and rerun. Warnings do not fail the run but usually point to a finding about a page outside the sample, or a critical finding that rests on inference.
