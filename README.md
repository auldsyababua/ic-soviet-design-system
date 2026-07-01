# THE FACILITY — Design System

A control-panel design system for **THE FACILITY** — a band-world site themed as a decaying 1980s Soviet black-hole research complex (Black-Mesa-adjacent).

> **Design thesis:** clean, crisp UI inside a dirty, dangerous, state-operated world. Decayed but not muddy. Industrial but premium. **Color = signal** — never decorative neon, never purple. _Dirt lives in the world; never on the UI._

It ships the reusable _physical-control vocabulary the whole world is made of_ — design tokens, fonts, and ~15 React components — so the FACILITY site's front end is composed from real, on-brand, shippable parts. Built to upload to **claude.ai/design** (so the design agent builds _with_ these components) and to be imported directly by the eventual Next.js app.

## Status

🟡 **Design approved · implementation pending.** This repo currently holds the approved design spec and an interactive token preview. The component library (`@facility/ds` package, Storybook, the 15 components) is the next step.

| Artifact                                        | State                                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| Design spec                                     | ✅ `docs/superpowers/specs/2026-06-30-facility-design-system-design.md` |
| Token preview (interactive)                     | ✅ `design-preview/tokens.html`                                         |
| `@facility/ds` package · Storybook · components | ⏳ planned                                                              |

## The token preview

Open the interactive token sheet — rendered _in_ the aesthetic (palettes, type specimens, material recipes, live motion demos):

```bash
open design-preview/tokens.html
```

Fonts load from Google Fonts + jsDelivr on first open; the page respects `prefers-reduced-motion`.

## What's planned

**Foundations** — CSS-variable design tokens (the color=signal palette, three type roles, material/surface recipes, geometry, machined motion curves, light/elevation), a Tailwind preset, and self-hosted fonts.

**~15 components**, in four groups:

- **Controls** — `Panel`, `Switch`, `Knob`, `Button`, `RotaryDial`
- **Displays** — `Gauge`, `SegmentDisplay`, `Indicator` (LED), `CRTScreen`, `MimicPanel`
- **Signage** — `SignagePlate`, `HazardStrip`, engraved icon set
- **Panels** — `StationPanel` (the canonical bezel assembly)

Each: typed props, token-driven styling, reduced-motion + keyboard + SSR-safe, full Storybook stories.

> The DS ships the _parts_. The Claude design agent composes the stations (discography, tour, gallery, press) _from_ these parts — that's the point of the upload.

## Stack (planned)

React + TypeScript · Tailwind (preset) + token-driven CSS Modules · Storybook 8 (Vite) · `tsup` → `dist/` (ESM + `.d.ts` + CSS) · pnpm.

## Roadmap

1. **Build** the design system (this repo).
2. **Upload** to claude.ai/design via `/design-sync` — Storybook shape, so every component preview is screenshot-verified against its own render before the design agent ever sees it.
3. **Scaffold** the non-visual FACILITY app parts (content model, station↔angle map, R2 media manifest, API stubs) so the design agent's front end drops straight in.

## Docs

- **Design spec:** [`docs/superpowers/specs/2026-06-30-facility-design-system-design.md`](docs/superpowers/specs/2026-06-30-facility-design-system-design.md)

## License

TBD. Bundled fonts (Saira Condensed, Stardos Stencil, DSEG, IBM Plex Sans / Mono) ship under their respective OFL/open licenses.
