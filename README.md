# Avish Taxi Tangalle

Website for **Avish Taxi Tangalle**: taxi, airport transfers and private tours from Tangalle, Sri Lanka.

Live site: **https://avishtaxi.github.io/**

It's plain HTML, CSS and JavaScript with no build step. GitHub Pages serves it straight from the `main` branch.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The home page and the single source of the design: styles, icons, header, footer, booking forms and script are built in |
| `colombo-airport-to-tangalle-taxi/`, `mattala-airport-to-tangalle-taxi/`, `tangalle-to-*-taxi/` | One landing page per taxi route (price, time, route, FAQ, booking), each targeting the search people actually type, e.g. "Colombo Airport to Tangalle taxi" |
| `sri-lanka-taxi-guide/` | Guide for foreign visitors: how taxis work in Sri Lanka, prices, tips |
| `assets/site.css`, `assets/site.js` | Shared styles and script for the landing pages, copied from `index.html` by the build script |
| `tools/build_pages.py` | Builds the landing pages, `llms.txt` and `sitemap.xml`. Run `python3 tools/build_pages.py` after changing `index.html`, prices or route text |
| `llms.txt` | Plain-language summary of the business, prices and pages for AI assistants (ChatGPT, Claude, Perplexity, Gemini) |
| `57a3ff78275181cb643afdca11d016fc.txt` | IndexNow key, lets Bing, Yandex and other engines be told instantly when pages change |
| `images/` | Real photos of Tangalle and the south coast in 800 / 1200 / 1600 px WebP with JPEG fallbacks, plus a portrait crop of the hero for phones |
| `credits.html` | Photographer credits and licences for every photo (required by the CC licences, so keep it linked in the footer) |
| `404.html` | Friendly "page not found" page |
| `favicon.svg`, `*.png`, `site.webmanifest` | Icons and "Add to home screen" support |
| `robots.txt`, `sitemap.xml` | Help search engines and AI crawlers find and index every page (the sitemap also lists the images) |
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

Prices are Avishka's real fares in **Sri Lankan Rupees (LKR)**, per vehicle (car / van or shuttle), with a note that they can be negotiated and may change from day to day. Also confirm the **fleet** and the promises in **About** and **FAQ** are true. Prices also appear in the JSON-LD `hasOfferCatalog` in `<head>` of `index.html` and in the `ROUTES` list in `tools/build_pages.py` (which builds the route pages and `llms.txt`); keep them in sync and re-run the build script.

## Photos

All photos are real photographs of Sri Lanka from Wikimedia Commons under Creative Commons / free licences. Each one is credited on `credits.html`. Vehicle photos show the *type* of vehicle; swapping in photos of Avishka's own car and van is the single best upgrade. To replace a photo, keep the same file names (`images/sedan.jpg` + `images/sedan.webp`) or update the `<picture>` tags.

## Adding a real video

Short, steady phone clips (5–15 seconds, landscape, filmed by Avishka: the car, an airport pickup, the coast road) work far better than stock footage. Send them and they can be compressed and added to the gallery.

## SEO and AI-search checklist

Done on the site:
- A landing page for each high-intent taxi search (airport transfers and the 6 most popular routes from Tangalle) plus a Sri Lanka taxi guide for visitors, all interlinked with the home page
- Answer-first content ("Quick answer" boxes, an "At a glance" fact list, FAQ) that Google and AI assistants can quote directly
- Structured data on every page: `LocalBusiness` + `TaxiService` with LKR offers, `Service`, `FAQPage`, `BreadcrumbList`, `Article`, `Person` (Avishka)
- `llms.txt` and a `robots.txt` that explicitly welcomes AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others)
- Image sitemap covering every page, canonical URLs, Open Graph cards, fast mobile pages (Lighthouse SEO 100 on every page)

Do these yourself (they need your accounts):
1. **Google Search Console** (verified): open *Sitemaps*, enter `sitemap.xml` and press *Submit*. Then use *URL Inspection* → *Request indexing* for the home page and the Colombo Airport page.
2. **Bing Webmaster Tools**: sign in at https://www.bing.com/webmasters and choose *Import from Google Search Console*. Bing also powers ChatGPT and Copilot search.
3. **IndexNow ping** (Bing, Yandex, Seznam, Naver): open this link once after each update: https://api.indexnow.org/indexnow?url=https://avishtaxi.github.io/&key=57a3ff78275181cb643afdca11d016fc
4. **Google Business Profile** for "Avish Taxi Tangalle" with this website, the WhatsApp number, photos of the car and Avishka. This matters most for "taxi near me" and Google Maps.
5. **Reviews**: ask every happy guest for a Google review. Also list on TripAdvisor. Reviews are the strongest local ranking signal and what AI assistants cite.
6. **Mentions**: get the site linked from hotel and villa partners in Tangalle, Facebook/Instagram profiles and travel forums (each link is a vote of trust).
7. Re-test occasionally with the [Rich Results Test](https://search.google.com/test/rich-results) and [PageSpeed Insights](https://pagespeed.web.dev/).

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
