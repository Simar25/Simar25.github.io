# Simarjot Singh Anand — Portfolio

A graffiti / street-paper themed portfolio built with React, Vite and Framer Motion.

- Spray-paint wall in the hero: pick a can, click + drag to tag it (hold still and the paint drips), save or buff it.
- Draggable stickers, torn-paper sections, drippy titles, rubber stamps and a scroll-driven tape marquee.
- Respects `prefers-reduced-motion`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

1. Push this folder to a GitHub repo (branch `main`).
2. On GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and publishes the site via `.github/workflows/deploy.yml`.

The workflow sets Vite's `base` automatically, so it works both for `username.github.io`
and for project repos served at `username.github.io/<repo>/`.

## Your CV

The "Download CV" button links to `public/resume.pdf` — drop your PDF there.
