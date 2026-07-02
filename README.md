# THE FACILITY — Design System

A control-panel design system for **THE FACILITY** — a band-world site themed as a decaying 1980s Soviet black-hole research complex (Black-Mesa-adjacent).

> **Design thesis:** clean, crisp UI inside a dirty, dangerous, state-operated world. Decayed but not muddy. Industrial but premium. **Color = signal** — never decorative neon, never purple. _Dirt lives in the world; never on the UI._

`@facility/ds` ships the reusable _physical-control vocabulary the whole world is made of_ — design tokens, self-hosted fonts, and 15 React components — so the FACILITY site's front end is composed from real, on-brand, shippable parts. Built to upload to **claude.ai/design** (so the design agent builds _with_ these components) and to be imported directly by the eventual Next.js app.

## Status

🟢 **Foundations + components built.** Tokens, fonts, materials, all 15 components, and Storybook are implemented and green (typecheck · lint · build · unit tests · Storybook build · play-function smoke-run, in CI).

| Artifact                       | State                                            |
| ------------------------------ | ------------------------------------------------ |
| Design spec                    | ✅ `docs/superpowers/specs/…-design.md`          |
| Token preview (interactive)    | ✅ `design-preview/tokens.html`                  |
| Tokens · fonts · materials     | ✅ `src/tokens` · `fonts/` · `src/styles`        |
| Components (15) · Storybook    | ✅ `src/components` · `src/icons` · `.storybook` |
| CI · pre-commit/pre-push hooks | ✅ GitHub Actions · husky                        |

## Components

- **Controls** — `Panel`, `Switch`, `Knob`, `Button`, `RotaryDial`
- **Displays** — `Gauge`, `SegmentDisplay`, `Indicator` (LED), `CRTScreen`, `MimicPanel`
- **Signage** — `SignagePlate`, `HazardStrip`, engraved icon set (`Trefoil`, `HighVoltage`, `ValveFlow`, `Warning`)
- **Panels** — `StationPanel` (the canonical bezel assembly)

Each: typed props, token-driven styling, reduced-motion + keyboard + SSR-safe, full Storybook stories. Color reaches components only as a semantic `signal` role (`ambient | decay | active | hazard | ok`) — never a raw color.

## Develop

```bash
pnpm install
pnpm storybook      # component gallery at http://localhost:6006
pnpm check          # typecheck + lint + build + unit tests + storybook build
pnpm test:stories   # play-function smoke run (needs a running storybook)
```

## Install & use

```bash
pnpm add @facility/ds
```

```tsx
import '@facility/ds/styles.css'; // tokens + fonts + material layer (self-contained)
import { StationPanel, Switch, Gauge, Indicator } from '@facility/ds';

export function ReactorHall() {
  const [armed, setArmed] = useState(false);
  return (
    <StationPanel
      title="REACTOR HALL · CONTAINMENT 04"
      hazard
      status={<Indicator signal="active" on label="ARC-BLUE" />}
    >
      <Switch checked={armed} onChange={setArmed} kind="guarded" label="SCRAM" />
      <Gauge value={412} min={0} max={600} unit="K" hazardFrom={520} />
    </StationPanel>
  );
}
```

Optional — consume the tokens as Tailwind theme/utilities for layout:

```ts
// tailwind.config.ts
import preset from '@facility/ds/preset';
export default { presets: [preset], content: ['./src/**/*.{ts,tsx}'] };
```

**Exports:** `.` (components + hooks + `ease`/`dur`/`signalVar` + `Signal`/`Size` types) · `./styles.css` · `./tokens.css` · `./preset`.

## Roadmap

1. **Build** the design system — _done for foundations + all 15 components._
2. **Upload** to claude.ai/design via `/design-sync` — Storybook shape, so every component preview is screenshot-verified against its own render before the design agent sees it.
3. **Scaffold** the non-visual FACILITY app parts (content model, station↔angle map, R2 media manifest, API stubs) so the design agent's front end drops straight in.

## Docs

- **Design spec:** [`docs/superpowers/specs/2026-06-30-facility-design-system-design.md`](docs/superpowers/specs/2026-06-30-facility-design-system-design.md)
- **Implementation plan:** [`docs/superpowers/plans/2026-06-30-facility-design-system.md`](docs/superpowers/plans/2026-06-30-facility-design-system.md)

## License

`UNLICENSED` (proprietary — THE FACILITY / band project). Bundled fonts (Saira Condensed, Stardos Stencil, DSEG 7/14, IBM Plex Sans / Mono) ship under their respective OFL/open licenses — see `fonts/OFL-*.txt`.
