# Office Fit-Out Estimator

An interactive quoting tool for a premium commercial interiors firm. A salesperson sets
the floor area and specification tier during a client meeting; the indicative cost and
construction programme recalculate live, with no page reloads.

> Front-end prototype. All pricing is **indicative dummy data** — not a formal quotation.

**Live demo:** _add your deployment URL here_

---

## What it does

| Step | Control | Effect |
| --- | --- | --- |
| **01 · Core dimensions** | Slider (rendered as an architectural dimension line) or a typed figure, 2,000–40,000 SF | Sets the base quantity; derives the workstation count |
| **02 · Material & system tiers** | Four segmented controls — Acoustic, Furniture, Smart AV, Lighting | Swaps each system between quality grades |
| **Live estimate** | — | A sticky title-block panel: indicative cost, programme in weeks, blended $/SF, full schedule of quantities, and a phased programme bar — all updating instantly |

The configuration and client name persist in `localStorage`, so the tool reopens where it
was left.

## Pricing model

Square footage drives everything. See [`src/lib/pricing.ts`](src/lib/pricing.ts) for the
full rate card; the short version:

- **Base fit-out** — $165 / SF, always included
- **Acoustic** — $8 / SF standard, $22 / SF premium
- **Furniture** — $2,200 / $4,800 / $8,500 per workstation (basic / executive / custom), at one workstation per 160 SF
- **Smart AV** — $85,000 flat (boardroom) or $45,000 + $9 / SF (full-floor)
- **Lighting** — $6 / $14 / $28 per SF (standard / tunable-white / circadian)
- **Professional fees** 12% + **contingency** 5% on hard cost

The programme is a sum of phase durations (design, procurement, construction, fit-out,
handover); construction scales with area and premium tiers add long-lead time to
procurement and fit-out.

At 12,000 SF the estimate ranges from **≈ $2.81M / 12 weeks** (all standard) to
**≈ $3.94M / 24 weeks** (all premium).

## Design

Matte, architectural, built to read as construction documentation rather than a tech
product: a warm-grey paper ground with a faint drafting grid, a single brass accent,
`Archivo` (expanded for the monumental figures) paired with `IBM Plex Mono` for every
number and dimension. The configurator is styled as a drawing sheet; the estimate panel
is its title block. Hairline rules, no drop shadows, no rounded corners. Locks to a
single landscape screen on tablet and desktop.

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · Vitest

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pricing-model unit tests
npm run build      # production build to dist/
```

## Deploy

Asset paths are relative (`base: './'`), so any static host works.

- **Vercel / Netlify** _(recommended)_ — import the repo; the Vite preset needs no
  configuration. You get a live URL that redeploys on every push.
- **GitHub Pages** — ready-made CI and Pages workflows live in
  [`.github/workflows-disabled/`](.github/workflows-disabled/). Move that folder to
  `.github/workflows/` (commit it from the GitHub web editor, or push with a token that
  has the `workflow` scope), then set Settings → Pages → Source: **GitHub Actions**.
