# Hilltop Truck Park Website

Next.js 14 site for Hilltop Truck Park, a food truck court in Northlake, TX. Hosted at `hilltoptruckpark.signalandform.net`.

Part of the Signal & Form monorepo. Run from this directory.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the custom domain `hilltoptruckpark.signalandform.net` in Project Settings > Domains.
4. Create a CNAME record in your DNS: `hilltoptruckpark` → `cname.vercel-dns.com` (or follow Vercel's DNS instructions).

## Pages

- **Home** — Hero, location, food truck CTA
- **Events** — Event calendar placeholder
- **Our Food Trucks** — Rotating truck lineup info
- **Pricing** — Admission and parking info
- **Blog** — News and updates (2025 Up & Coming post)
- **Online Store** — Placeholder
- **Crawfish Pre-orders** — Placeholder form
- **Photo Fun** — Foam parties and photo ops
- **Vendor Requests** — Placeholder form
- **Contact Us** — Placeholder form

Forms and interactive elements (contact, vendor requests, crawfish pre-orders, online store, event registration) are placeholders. No API routes or backend services are configured.

## Project Structure

- `app/` — Next.js App Router pages and layout
- `components/` — Header, Footer, PlaceholderForm
- `lib/imageMap.ts` — Maps Wix image URLs to local paths
- `public/images/` — Images from scraped Wix site
