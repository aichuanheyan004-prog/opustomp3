# Launch Checklist

This is the practical checklist for launching `opustomp3.com` as a low-cost SEO tool site.

## Before Deploy

- Confirm the home page opens directly to the converter.
- Confirm every sitemap URL returns 200 on the static host.
- Confirm `robots.txt` points to `https://opustomp3.com/sitemap.xml`.
- Confirm canonical URLs use `https://opustomp3.com/`.
- Confirm the converter loads `assets/vendor/lame.all.js` locally.
- Test conversion in Chrome or Edge with a real `.opus` file.

## DNS And Hosting

- Deploy the folder to Cloudflare Pages, Vercel, Netlify, or GitHub Pages.
- Add `opustomp3.com` as the production domain.
- Redirect `www.opustomp3.com` to `opustomp3.com`.
- Force HTTPS.

## Search Console

- Add the domain property in Google Search Console.
- Verify DNS ownership.
- Submit `https://opustomp3.com/sitemap.xml`.
- Use URL Inspection for the home page and request indexing.

## First 30 Days

- Check GSC impressions every 3-5 days.
- Track queries that contain `opus`, `mp3`, `whatsapp`, `telegram`, `ogg`, `voice`, and `without upload`.
- Improve pages that get impressions but low CTR.
- Add new pages only for real query clusters that appear in GSC.
- Keep the tool fast and useful before adding monetization.

## Later Experiments

- Add `ffmpeg.wasm` only if browser-native decoding misses too many files.
- Add batch conversion only if users ask for it.
- Add AdSense or affiliate placements only after search traffic is stable.
