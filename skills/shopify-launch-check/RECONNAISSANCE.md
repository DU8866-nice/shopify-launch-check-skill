# Phase 1 — Reconnaissance

Goal: build a small but representative sample of pages, so the checks in Phase 2 cover every template the store uses without reading the whole catalogue.

## Steps

1. **Open the home page.** Confirm the store loads and is not showing Shopify's password page. If it is, stop and ask the user whether the store is meant to be live; if not, ask for the storefront password or page content.
2. **Read the navigation.** Collect every link in the main menu and the footer.
3. **Fetch `/sitemap.xml`.** Shopify serves a sitemap index linking to product, collection, page and blog sitemaps. Use it to count products and collections and to find pages missing from the menu.
4. **Fetch `/robots.txt`.** Keep the content for the SEO checks.
5. **Choose the sample.** Pick:
   - the home page
   - one or two collections, including the largest one
   - three product pages: a best seller or featured product, the product with the most variants, and the cheapest product
   - the cart page (add the cheapest product to the cart to see it populated)
   - every policy page: refund, privacy, terms of service, shipping, contact information
   - the contact and about pages
   - the search results page for an obvious product term
   - a deliberately broken URL such as `/this-page-does-not-exist` to see the 404 page
6. **Record the sample** as the `pages_checked` list. Every finding's location in Phase 2 should be one of these URLs, or `admin` for items only visible in Shopify admin.

## Tools

Use whatever page-reading or browser tool is available. Shopify themes render most content server-side, so a plain fetch usually works. If a page comes back as an empty shell, switch to a browser tool; if none is available, add the page to "Not checked" with the reason.

## Time budget

Keep the sample to about 15 pages. A larger store does not need a larger sample unless it uses more page templates.
