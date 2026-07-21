# OpusMP3

A low-cost static MVP for `opustomp3.com`.

## What it does

- Targets the `opus to mp3` search intent with a working converter on the first screen.
- Converts in the browser with Web Audio plus a local `lamejs` encoder, so there is no backend upload.
- Includes SEO basics: canonical URLs, SoftwareApplication structured data, robots.txt, sitemap.xml, and internal content pages.
- Follows the Ge Fei-style low-cost workflow: one real tool first, useful long-tail pages second, Search Console feedback third.

## Keyword plan

Primary page:

- `/` targets `opus to mp3`, `opus to mp3 converter`, and `convert opus to mp3`.

Support pages:

- `/how-to-convert-opus-to-mp3` targets guide-style searches.
- `/convert-opus-to-mp3-without-upload` targets privacy-focused searches.
- `/whatsapp-opus-to-mp3` targets WhatsApp voice-note searches.
- `/telegram-opus-to-mp3` targets Telegram voice-message searches.
- `/opus-vs-mp3` targets comparison searches and internal linking.

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static server.

## Deploy

Any static host works:

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

Point `opustomp3.com` to the chosen host, then submit `https://opustomp3.com/sitemap.xml` in Google Search Console.

## Next low-cost growth steps

- Add Google Search Console and Bing Webmaster Tools.
- Add privacy-friendly analytics after launch.
- Watch queries for 1-2 weeks, then add pages for terms that receive impressions.
- Consider a `ffmpeg.wasm` fallback only if users report files that Web Audio cannot decode.
- Avoid empty programmatic pages. Add a new page only when it answers a distinct search intent.
