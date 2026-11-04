# Avish Taxi Tangalle

Website for **Avish Taxi Tangalle**: taxi, airport transfers and private tours from Tangalle, Sri Lanka.

Live site: **https://avishtaxi.github.io/**

It's plain HTML, CSS and JavaScript with no build step. GitHub Pages serves it straight from the `main` branch.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The whole one-page site: styles, icons and script are built in |
| `images/` | Real photos of Tangalle and the south coast in 800 / 1200 / 1600 px WebP with JPEG fallbacks, plus a portrait crop of the hero for phones |
| `credits.html` | Photographer credits and licences for every photo (required by the CC licences, so keep it linked in the footer) |
| `404.html` | Friendly "page not found" page |
| `favicon.svg`, `*.png`, `site.webmanifest` | Icons and "Add to home screen" support |
| `robots.txt`, `sitemap.xml` | Help search engines find and index the site (the sitemap also lists the images) |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Contact details

The WhatsApp and phone number **+94 76 562 7939** is already set throughout the site.

To add a booking email address, set `email` in the `CONFIG` block near the bottom of `index.html`. While it is empty, the email links and the **Send by email** button stay hidden. Also add it as `"email"` in the JSON-LD block in `<head>`.

Then check the `CONFIG` block near the bottom of `index.html`:

- `googleReviewsUrl` / `writeReviewUrl`: links to the Google Business profile and its "write a review" page.
- `facebook`, `instagram`: paste full URLs and the icons appear in the footer. Also add them to `"sameAs"` in the JSON-LD block in `<head>`.
- `formspreeId`: optional. Create a free form at formspree.io and paste its ID so **Send by email** submits without opening the visitor's email app.
- `driverPhoto`: add a real photo of Avishka (e.g. `images/avishka.jpg`). It replaces the beach photo in the "Meet your driver" section. A friendly photo of the driver next to the car builds a lot of trust.
- `reviews`: add **real** guest reviews only, copied with permission from Google, TripAdvisor or WhatsApp.

Prices are Avishka's real fares in **Sri Lankan Rupees (LKR)**, per vehicle (car / van or shuttle), with a note that they can be negotiated and may change from day to day. Also confirm the **fleet** and the promises in **About** and **FAQ** are true. Prices also appear in the JSON-LD `hasOfferCatalog` in `<head>`; keep both in sync.

## Photos

All photos are real photographs of Sri Lanka from Wikimedia Commons under Creative Commons / free licences. Each one is credited on `credits.html`. Vehicle photos show the *type* of vehicle; swapping in photos of Avishka's own car and van is the single best upgrade. To replace a photo, keep the same file names (`images/sedan.jpg` + `images/sedan.webp`) or update the `<picture>` tags.

## Adding a real video

Short, steady phone clips (5–15 seconds, landscape, filmed by Avishka: the car, an airport pickup, the coast road) work far better than stock footage. Send them and they can be compressed and added to the gallery.

## SEO checklist after launch

1. Open [Google Search Console](https://search.google.com/search-console), add `https://avishtaxi.github.io/` (URL-prefix property, verify with the HTML-tag method by adding the `<meta name="google-site-verification">` tag to `<head>`), then submit `sitemap.xml`.
2. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) (it can import from Google Search Console).
3. Create or claim the **Google Business Profile** for "Avish Taxi Tangalle" and put this site as the website. For a local taxi this matters more than anything else for ranking in Google Maps.
4. Ask happy guests for Google reviews, and list the business on TripAdvisor with a link back here.
5. Test with [Rich Results Test](https://search.google.com/test/rich-results) (LocalBusiness, FAQ) and [PageSpeed Insights](https://pagespeed.web.dev/).
6. Share the link on WhatsApp once to check the preview image.

## What's built in

- Mobile-first layout: thumb-friendly bottom booking bar on phones, swipeable photo gallery, large tap targets, no horizontal scrolling
- Sharp, steady photos: art-directed hero (portrait crop on phones), 800/1200/1600 px responsive sizes, no zoom effects on touch screens
- Tap-to-enlarge photo viewer with swipe and arrow-key navigation
- "Book in 3 steps" section and LKR price table
- Every WhatsApp button first opens a short form for that request (airport transfer, route, day tour, round tour, hotel pick-up, car hire, question), shows a live preview of the message, then opens WhatsApp with it ready to send
- Booking form at the bottom sends by WhatsApp, Formspree or email
- Light and dark mode
- SEO: descriptive title and meta description, canonical URL, Open Graph and Twitter cards, `LocalBusiness` + `TaxiService` (LKR offer catalog) + `FAQPage` structured data, geo tags, image sitemap, descriptive alt text on every photo
- Performance: responsive WebP images with `srcset`, lazy loading below the fold, preloaded hero image, no frameworks
- Accessibility: skip link, keyboard navigation, focus styles, ARIA labels, respects reduced-motion settings
