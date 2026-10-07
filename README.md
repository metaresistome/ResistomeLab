# Resistome Lab — Website

Official website of **Resistome Lab** at Shantou University Medical College — antimicrobial
resistance research across genomics, metagenomics, One Health surveillance, and bioinformatics.

**Live preview:** https://resistomelab.ok.kimi.link

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (scroll animations)
- Custom canvas particle hero (drugs & pathogens assembling a human figure)

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## Deploy

The site is fully static. Any static host works:

- **GitHub Pages** — automated via `.github/workflows/deploy.yml` on every push to `main`.
- **Netlify / Vercel** — build command `npm run build`, output directory `dist`.
- **Hostinger (or any shared host)** — upload the contents of `dist/` to `public_html`.

Routing uses hash-based paths, so no server-side rewrite rules are required.

## Content

All site content (research areas, people, publications, news) lives in
[`src/data/site.ts`](src/data/site.ts) — edit that file to update pages.

## Structure

```
src/
  components/    Navbar, Footer, ParticleHuman, shared UI
  pages/         Home, Research, Publications, Group, News, About, Contact
  data/site.ts   All site content in one place
public/
  images/        Optimized artwork and photos
```
