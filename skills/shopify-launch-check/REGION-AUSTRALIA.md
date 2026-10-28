# Phase 2d — Regional rules: Australia `[regional]`

Use this file when the store sells to Australian consumers.

These items are prompts to check, not legal or tax advice. Every regional finding must name the rule it relates to in its `rule` field, and the report should suggest the user confirm with the ACCC, the ATO or an adviser.

## Single total price — Australian Consumer Law, section 48

A price shown to consumers needs a prominent single total price that includes GST and any other mandatory, quantifiable charges.

- Product, collection and cart prices shown excluding GST to consumers: **critical**.
- A price shown in parts (for example "$1,299 + delivery fee") without the total shown at least as prominently: **critical**.
- **(admin)** Shopify's tax setting for including tax in displayed prices is on.

## No surprise fees — drip pricing

- A mandatory fee that first appears at checkout (booking, handling, surcharge) is a drip pricing risk: **important**, or **critical** if the fee is large relative to the price.

## Refund and returns wording — consumer guarantees

Consumer guarantees cannot be excluded or limited by a store policy, and this applies to online stores' returns policies.

- Wording such as "No refunds", "No refunds on sale items", "Exchange or store credit only", "No refunds after 7 days" or "Refunds on unused items only", where it is not limited to change of mind: **critical**.
- Wording that only refuses change-of-mind returns, for example "We don't offer refunds if you simply change your mind", is acceptable.
- Check the returns policy, FAQ, product pages, cart notes and footer.

## Warranties and trials

- An extra warranty or sleep/home trial is fine, but the policy should not suggest it replaces the consumer guarantees: **important** if it does.

## Tax invoices — ATO requirements

If the business is registered for GST and customers use order confirmations or invoices as tax invoices:

- **(admin)** For sales under $1,000, the document identifies itself as a tax invoice and shows the seller's identity, the seller's ABN, the date, what was sold with quantity and price, and the GST amount or a statement that the total includes GST.
- **(admin)** For sales of $1,000 or more, it also shows the buyer's identity or ABN. Flag this for high-price stores (furniture, mattresses, electronics) as **important**.

## Business details

- The legal business name and ABN on the contact or about page is a common trust signal for Australian shoppers: **nice to have** if missing.

## Adding another region

Copy this file to `REGION-<COUNTRY>.md`, keep the `[regional]` category, and list that country's rules on price display, refunds and consumer rights, tax invoices and marketing consent. Each item should be a check the agent can actually perform, plus the severity to assign and the rule to cite.
