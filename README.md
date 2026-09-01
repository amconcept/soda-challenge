# SOD+A CHALLENGE

Animated hero + scrolling intro site for [sodachallenge.org](https://sodachallenge.org).

Live mockup (GitHub Pages): **https://amconcept.github.io/soda-challenge/**

The Claude Design prototype in `design/` is the visual reference. Production code lives in `components/hero/` and `app/`.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Compare against `design/SODA Logo Reveal.dc.html`.

```bash
npm run build
```

Writes a static site to `out/` (GitHub Pages).

## Hosting

The site is deployed from `main` via GitHub Actions to GitHub Pages.

Custom domain `sodachallenge.org` (Squarespace registrar) is next, once DNS is pointed at GitHub:

1. Squarespace → **Settings → Domains → sodachallenge.org → DNS**.
   - Apex `sodachallenge.org` — four A records:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - `www` — CNAME to `amconcept.github.io`
2. GitHub repo → Settings → Pages → Custom domain → `sodachallenge.org` (HTTPS).
3. Then set `BASE_PATH=""` in `.github/workflows/deploy.yml` so the site is served at the domain root, not `/soda-challenge/`.
