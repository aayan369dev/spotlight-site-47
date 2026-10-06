# Spotlight website

Static, animated site. No build step and no server needed. Upload every file in this folder to one host folder.

## Files
| File | Purpose |
|---|---|
| index.html | Home page: markup, SEO tags, social preview tags, structured data |
| style.css | All styling and animation |
| main.js | Animations, approval demo, chat assistant, enquiry form |
| robots.txt, sitemap.xml, llms.txt | Search engine and AI crawler files |
| logo-full.png | Full logo |
| logo-mark.png / .webp | Spotlight lamp, transparent background (hero image) |
| logo-wordmark.png / .webp | SPOTLIGHT wordmark, transparent background (footer) |
| favicon-32.png, favicon-180.png, favicon-512.png | Browser, Apple and app icons |
| privacy.html, terms.html | Legal pages (templates, see below) |
| 404.html | Custom "page not found" page |
| consent.js | Cookie banner and Google Analytics loader |
| og-image.jpg | 1200x630 social preview image (WhatsApp, LinkedIn, X) |
| site.webmanifest | Home-screen icon and colours |
| _headers | Security headers for Netlify and Cloudflare Pages |
| .htaccess | HTTPS redirect, headers, caching and 404 for Apache hosts |

## Before going live (required)
1. **Domain.** Replace `yourdomain.com` in index.html, privacy.html, terms.html, 404.html, robots.txt, sitemap.xml and llms.txt.
2. **Email.** Replace `hello@yourdomain.com` in index.html (contact section) and in the legal pages.
3. **Legal pages.** privacy.html and terms.html are templates. Fill every yellow `[placeholder]` (company name, address, jurisdiction) and have a lawyer review them. They are not legal advice.
4. **Contact form.** Without a form service the form opens the visitor's email app with the message prefilled. To receive messages directly, create a free form endpoint (Formspree, Web3Forms or similar) and paste its URL into `ENDPOINT` at the bottom of main.js. If you use a host other than formspree.io, add it to `connect-src` and `form-action` in `_headers` / `.htaccess`.
5. **Analytics.** Create a Google Analytics 4 property and paste its Measurement ID (G-XXXXXXXXXX) into `GA_ID` at the top of consent.js. Analytics only loads after a visitor accepts the cookie banner.
6. **HTTPS.** Netlify, Vercel, Cloudflare Pages and GitHub Pages force HTTPS automatically; enable it in their settings. On Apache hosts, `.htaccess` does it.

## Launch checklist status
- Privacy policy, terms: done (templates, fill in).
- Cookie consent banner: done; "Cookie settings" link in footer reopens it.
- Frontend secrets: none in the code. The chat assistant needs no API key. Never put API keys in main.js; use a backend for anything private.
- HTTPS and security headers: `_headers` and `.htaccess` (includes HSTS and a Content-Security-Policy).
- Meta titles and descriptions, social preview image, favicons, sitemap, robots.txt: done.
- Image alt text: done (decorative images have empty alt). Images compressed: WebP with PNG fallback.
- Page speed: hero image preloaded, scripts deferred, fonts use `display=swap`, below-the-fold image lazy-loaded. Test your live URL at pagespeed.web.dev.
- Colour contrast: all text pairs checked at 4.5:1 or better.
- Mobile: tested at 390px wide with no sideways scrolling.
- Custom 404: done. Broken links: all internal links checked.
- Form validation: required fields, email format, 20-character message minimum, consent tick, live error messages.
- Spam protection: hidden honeypot field, minimum fill time, 60-second resend limit. For stronger protection add Cloudflare Turnstile or hCaptcha (needs a free key from them).
- Single clear CTA: one primary action everywhere, "Book a strategy call".

## Chat assistant
Rule-based and runs fully in the browser. Edit the `KB` list in main.js to change answers: each entry has keywords (`k`), a reply (`t`), an optional section link (`g`, `gl`) and follow-up buttons (`c`). For free-form AI answers, connect it to an AI API through a small backend that holds your API key.

## Notes
- Fonts (Cinzel, Fraunces, Manrope) load from Google Fonts, with system fallbacks. The privacy template mentions this. Self-host the fonts if you want zero third-party requests.
- Animations switch off for visitors who enable "reduce motion" in their system settings.
