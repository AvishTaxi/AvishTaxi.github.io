# Avish Taxi Tangalle

Website for **Avish Taxi Tangalle**: taxi, airport transfers and private tours from Tangalle, Sri Lanka.

Live site: **https://avishtaxi.github.io/**

It's plain HTML, CSS and JavaScript with no build step. GitHub Pages serves it straight from the `main` branch.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The whole one-page site: styles, icons and script are built in |
| `images/` | Real photos of Tangalle and the south coast, in WebP (with an 800 px mobile size) and JPEG fallbacks |
| `video/` | Background and gallery videos (MP4, H.264, muted, small for mobile) |
| `credits.html` | Photographer credits and licences for every photo and video (required by the CC licences, so keep it linked in the footer) |
| `404.html` | Friendly "page not found" page |
| `favicon.svg`, `*.png`, `site.webmanifest` | Icons and "Add to home screen" support |
| `robots.txt`, `sitemap.xml` | Help search engines find and index the site (the sitemap also lists the images and video) |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Before going live: replace the placeholders

Open `index.html` and use **Find & Replace (all)** for each of these:

| Find | Replace with |
|---|---|
| `94770000000` | Avish's WhatsApp number: country code plus number, digits only (e.g. `94771234567`) |
| `+94 77 000 0000` | The same number as it should appear on the page |
| `your-email@example.com` | The booking email address |

Then check the `CONFIG` block near the bottom of `index.html`:

- `googleReviewsUrl` / `writeReviewUrl`: links to the Google Business profile and its "write a review" page.
- `facebook`, `instagram`: paste full URLs and the icons appear in the footer. Also add them to `"sameAs"` in the JSON-LD block in `<head>`.
- `formspreeId`: optional. Create a free form at formspree.io and paste its ID so **Send by email** submits without opening the visitor's email app.
- `driverPhoto`: add a real photo of Avish (e.g. `images/avish.jpg`). It replaces the beach photo in the "Meet your driver" section. A friendly photo of the driver next to the car builds a lot of trust.
- `reviews`: add **real** guest reviews only, copied with permission from Google, TripAdvisor or WhatsApp.

Also confirm the sample **prices**, the **fleet** and the promises in **About** and **FAQ** are true. Prices also appear in the JSON-LD `hasOfferCatalog` in `<head>`; keep both in sync.

## Photos and videos

All photos are real photographs of Sri Lanka from Wikimedia Commons under Creative Commons / free licences. Each one is credited on `credits.html`. Vehicle photos show the *type* of vehicle; swapping in photos of Avish's own car and van is the single best upgrade. To replace a photo, keep the same file names (`images/sedan.jpg` + `images/sedan.webp`) or update the `<picture>` tags.

## SEO checklist after launch

1. Open [Google Search Console](https://search.google.com/search-console), add `https://avishtaxi.github.io/` (URL-prefix property, verify with the HTML-tag method by adding the `<meta name="google-site-verification">` tag to `<head>`), then submit `sitemap.xml`.
2. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) (it can import from Google Search Console).
3. Create or claim the **Google Business Profile** for "Avish Taxi Tangalle" and put this site as the website. For a local taxi this matters more than anything else for ranking in Google Maps.
4. Ask happy guests for Google reviews, and list the business on TripAdvisor with a link back here.
5. Test with [Rich Results Test](https://search.google.com/test/rich-results) (LocalBusiness, FAQ) and [PageSpeed Insights](https://pagespeed.web.dev/).
6. Share the link on WhatsApp once to check the preview image.

## What's built in

- Mobile-first layout: thumb-friendly bottom booking bar on phones, swipeable photo gallery, large tap targets, no horizontal scrolling
- Real photo hero with a background video that loads only on good connections (skipped with data-saver or "reduce motion")
- Every "Book" button opens WhatsApp with a pre-filled message; booking form sends by WhatsApp, Formspree or email
- Light and dark mode
- SEO: descriptive title and meta description, canonical URL, Open Graph and Twitter cards, `LocalBusiness` + `TaxiService` + `FAQPage` + `VideoObject` structured data, geo tags, image sitemap, descriptive alt text on every photo
- Performance: responsive WebP images with `srcset`, lazy loading below the fold, preloaded hero image, no frameworks
- Accessibility: skip link, keyboard navigation, focus styles, ARIA labels, respects reduced-motion settings
