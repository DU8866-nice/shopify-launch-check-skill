# Phase 2c — SEO, performance and accessibility

## SEO basics `[seo]`

- Every page in the sample has a unique `<title>` and meta description. The home page ones are written for this store, not the theme default.
- Each page has one `<h1>` that describes it.
- URLs are readable (`/products/cloud-hybrid-queen`, not `/products/copy-of-product-12`).
- `/sitemap.xml` loads and lists products and collections.
- `/robots.txt` does not block the whole store.
- The home page has a social sharing (Open Graph) image set.
- **(admin)** The store is connected to Google Search Console, and analytics are set up.

## Speed `[performance]`

- Hero and product images are not oversized files. A single hero image over about 500 KB is worth flagging; mark it as inferred unless you measured load time.
- Product pages do not load a long list of third-party app scripts. If you can see many, mention that unused apps slow the store.
- Images below the first screen are lazy-loaded where the theme supports it.

## Accessibility and mobile `[accessibility]`

- Body text has enough contrast against its background. No light grey text on white for body copy.
- Buttons and links have readable labels. Icon-only buttons have an accessible name.
- Form fields have visible labels, not placeholder text only.
- At phone width (about 390px), there is no horizontal scrolling, tap targets are not cramped, and a sticky header does not cover content.
- If no browser tool with resizing is available, add mobile layout to "Not checked".
