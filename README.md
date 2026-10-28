# shopify-launch-check

A coding-agent skill that audits a Shopify store before launch and returns a prioritised fix list, in Markdown for people and validated JSON for tools.

[中文说明](README.zh-CN.md)

## What it does

Give your agent a store URL. The skill walks the storefront the way a first-time customer, a search engine and a regulator would, in three phases:

1. **Reconnaissance** — maps the store from its menu, footer and sitemap, and picks a small sample that covers every page template.
2. **Checks** — runs storefront, checkout and policy, SEO and performance, and regional checks against that sample.
3. **Reporting** — grades every finding as `critical`, `important` or `nice_to_have`, writes a Markdown report and a JSON report, and validates the JSON.

Each finding records where it is, what was seen, why it matters, the concrete fix, and whether it was **observed** or **inferred**. Australian consumer and tax rules are built in: single total price including GST, unlawful "no refunds" wording, and tax invoice details.

The skill never places orders, submits forms or enters payment details. Anything that needs Shopify admin is listed for you to confirm.

## Files

All skill files live in `skills/shopify-launch-check/`.

| File | Purpose |
|---|---|
| `SKILL.md` | Entry point: inputs, three-phase workflow, rules |
| `RECONNAISSANCE.md` | Phase 1: map the store and choose the page sample |
| `STOREFRONT.md` | Phase 2a: reachability, home page, collections, product pages |
| `CHECKOUT-AND-POLICIES.md` | Phase 2b: cart and checkout, policy and trust pages, notifications |
| `SEO-AND-PERFORMANCE.md` | Phase 2c: SEO basics, speed, accessibility, mobile |
| `REGION-AUSTRALIA.md` | Phase 2d: Australian Consumer Law pricing and refunds, ATO tax invoices |
| `REPORTING.md` | Phase 3: severity levels, Markdown and JSON report formats |
| `report-schema.json` | JSON Schema (draft 2020-12) for `launch-check-report.json` |
| `validate-report.cjs` | Dependency-free validator with cross-field checks |
| `validate-report.test.cjs` | Tests for the validator (`node --test`) |

## Installation

Install into the current project:

```bash
npx skills add https://github.com/DU8866-nice/shopify-launch-check-skill --skill shopify-launch-check
```

Install for your user, across all projects:

```bash
npx skills add https://github.com/DU8866-nice/shopify-launch-check-skill --skill shopify-launch-check --global
```

See `npx skills --help` for choosing agents and non-interactive options.

To install by hand for Claude Code, copy the folder:

```bash
git clone https://github.com/DU8866-nice/shopify-launch-check-skill.git
cp -r shopify-launch-check-skill/skills/shopify-launch-check ~/.claude/skills/
```

For the Claude app, zip the `skills/shopify-launch-check` folder and upload it in Claude's skills settings.

## Usage

Ask your agent in plain language:

```
Check whether https://your-store.com.au is ready to launch.
```

```
Use shopify-launch-check on my product pages and refund policy. The store sells in Australia.
```

The agent confirms the store URL, selling region and whether it has admin access, then runs the three phases. It writes `launch-check-report.md` and `launch-check-report.json` and validates the JSON:

```bash
node skills/shopify-launch-check/validate-report.cjs launch-check-report.json
```

Example excerpt (fictional store):

```markdown
## Critical (1)
1. **Refund policy excludes sale items** — /policies/refund-policy
   - Problem: The policy says sale items cannot be refunded.
   - Why it matters: Consumer guarantees still apply to sale items; this wording is generally unlawful in Australia.
   - Fix: Limit the exclusion to change-of-mind returns.
```

## Requirements

- An agent that supports skills, such as Claude Code or the Claude app.
- A tool that can fetch web pages. A browser tool is needed for the mobile layout checks; without one, those checks are reported as not checked.
- Node.js 18 or later to run the validator and its tests (optional).

## Design principles

- **See it as a visitor.** Every storefront check is something a customer could notice. Admin-only items are listed for the owner to confirm, never guessed.
- **Observed or inferred, always labelled.** A finding says whether it was seen directly or reasoned from indirect evidence, and the validator warns when a critical finding rests on inference.
- **No side effects.** The audit reads pages and may add one item to the cart. It never orders, subscribes or submits.
- **Small, representative sample.** About 15 pages that cover every template beat crawling the whole catalogue.
- **Machine-readable output.** The JSON report follows a published schema, so results can feed dashboards, CI checks or follow-up agents.
- **Rules are prompts, not advice.** Regional findings name the rule they relate to and point the owner to the official source.

## Contact

Questions, bugs and new regional rule files are welcome as [GitHub issues](https://github.com/DU8866-nice/shopify-launch-check-skill/issues). To add a region, copy `REGION-AUSTRALIA.md` to `REGION-<COUNTRY>.md` and open a pull request.

## License

[MIT](LICENSE)
