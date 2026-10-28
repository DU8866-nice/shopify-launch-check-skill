# Phase 2b — Checkout and policies

Items marked **(admin)** cannot be seen from the storefront. Without admin access, add them to `confirm_yourself` in the report.

Never enter payment details or complete a purchase. Stop at the cart page.

## Cart and checkout `[checkout]`

- The cart shows item, variant, quantity, unit price and total, and quantity changes work.
- Any extra charge (shipping, surcharges) is disclosed before the final step, not added as a surprise.
- The discount code field works if the store advertises codes.
- **(admin)** At least one end-to-end test order has been placed with Shopify's test payment mode, and the order confirmation email arrived and looked right.
- **(admin)** Shipping zones cover every region the store says it ships to, with rates that match what the site promises.
- **(admin)** The payment methods shown in the footer are the ones enabled at checkout.

## Policy and trust pages `[policies]`

- Refund or returns, privacy, terms of service, shipping and contact pages exist and are linked from the footer.
- None of them is Shopify template text with the placeholder business name or bracketed fields left in.
- Policies agree with each other and with what product pages promise, such as trial length and who pays return shipping.
- The contact page offers at least one way to reach a person (email, phone or form) and a business location or registered business details.
- The about page explains who is behind the store.
- Check the region file for wording that is unlawful in the selling region.

## Customer notifications `[notifications]`

- **(admin)** Order confirmation, shipping confirmation and other customer emails use the store's name, logo and sender address, not defaults.
- A newsletter signup, if present, says what subscribers will receive.
- **(admin)** Marketing emails include an unsubscribe link and go only to people who opted in.
