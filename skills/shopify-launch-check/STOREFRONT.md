# Phase 2a — Storefront

Items marked **(admin)** cannot be seen from the storefront. Without admin access, add them to `confirm_yourself` in the report.

Category names in brackets are the `category` values used in the JSON report.

## Store is open and reachable `[reachability]`

- Storefront password page is turned off, if the store is meant to be live. Password page on a launched store is **critical**.
- Custom domain loads over HTTPS, and the `www` and bare domain reach the same store.
- **(admin)** The custom domain is set as primary, so the `.myshopify.com` address redirects to it.
- Favicon and browser-tab title are the brand's, not Shopify or theme defaults.

## Home page and navigation `[home]`

- Within the first screen, a visitor can tell what the store sells and who it is for.
- There is one clear primary call to action, not several competing ones.
- Every main-menu and footer link works. No links to empty collections or placeholder pages.
- Footer contains contact details, policy links, and payment icons that match the payment methods actually enabled.
- No leftover theme demo content: sample images, "Lorem ipsum", "Your headline here", demo brand names.
- Store search returns sensible results for an obvious product term.

## Collection pages `[collections]`

- Every collection linked from the menu has products in it.
- Each collection has a short description, and its own image or banner where the theme supports one.
- Sorting and filtering work if shown.
- Sold-out products are either clearly labelled or hidden, consistently across collections.

## Product pages `[product]`

- Title is specific (product name plus key attribute), not a supplier code.
- Price is clear and matches the cart. See the region file for tax-inclusive pricing rules.
- Images show several angles at a consistent size, and each image has meaningful alt text.
- The variant picker (size, colour, firmness and so on) updates price, image and stock status.
- The description answers the usual pre-purchase questions: dimensions, materials, care, what is in the box, delivery time, returns or trial period.
- Shipping cost, or a link to shipping information, is visible before the cart.
- Add to cart works and gives clear feedback.
- Reviews, if displayed, come from an installed review app. An empty review widget looks worse than none.
- For high-price items, warranty, trial or guarantee terms are stated and link to the full policy.
