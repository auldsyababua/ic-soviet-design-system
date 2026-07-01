# THE FACILITY — Design System · Design Spec

- **Date:** 2026-06-30
- **Status:** Approved (brainstorming) → ready for implementation planning
- **Home:** `ic-soviet-design-system/` (this repo)
- **Source brief:** `facility-band-site-blueprint.md` (esp. §9 "Full aesthetic system")

---

## 1. Context & goal

THE FACILITY is a band-world website themed as a decaying 1980s Soviet black-hole research complex (Black-Mesa-adjacent). This spec covers **the design system only** — not the website.

The work sits inside a deliberate three-phase arc:

1. **Build** this design system (the subject of this spec).
2. **Upload** it to claude.ai/design via `/design-sync` so the Claude design agent builds the FACILITY site's front end from the band's _real_ compiled components — every design it produces is on-brand and maps 1:1 to shippable code.
3. **Then** (separate, later work) scaffold the non-visual app parts (content model, station↔angle map, R2 media manifest, API stubs, providers) so the front end the design agent produces drops straight in.

**Division of labor — the governing principle of scope:** this design system ships the _reusable physical-control vocabulary the whole world is made of_. The Claude design agent composes the actual stations (discography, tour, gallery, press) _from these parts_. We build the parts; the designer composes the pages. This is exactly what makes the upload valuable.

---

## 2. Scope

**Approach ① — Foundations + control-panel kit** (chosen).

**In scope:** design tokens, a Tailwind preset, self-hosted fonts, global material/CRT CSS utilities, and ~15 control-panel components (see §5), each Storybook-backed with full stories.

**Explicitly out of scope (the design agent's job):**

- Station / page compositions: discography reels/canisters, tour dispatch board, gallery surveillance feed, press document drawer.
- The rotating `ConsoleStage` / camera-yaw navigation controller.
- The cinematic layer: depth-displacement shader, 360 panorama viewer, Gaussian-splat scene, real-time PostFX (chromatic aberration, dust, flicker shaders).

The DS provides DOM control vocabulary; station composition and the cinematic layer are downstream.

---

## 3. Architecture

A standalone, self-contained **React + TypeScript** component library that is its **own git repo** (the parent `projects/` directory is just a workspace; a standalone repo is cleaner as an uploadable deliverable and independently versioned).

- **Package name:** `@facility/ds`
- **Bundle global (for design-sync `window.<globalName>`):** `FacilityDS`
- **Package manager:** pnpm
- **Component/story tooling:** Storybook 8 (React + Vite builder)
- **Library build:** `tsup` → `dist/` (ESM + `.d.ts` + a CSS layer)
- **Styling:** Tailwind preset (tokens → theme/utilities, for layout) **+** token-driven **CSS Modules** per component for the heavy skeuomorphic look.

### Why this shape

One build serves all three downstream consumers:

- **Storybook** is what `/design-sync` reads for the high-fidelity "storybook shape" (real screenshot-pair verification per component).
- **`dist/`** (compiled components + `.d.ts` + CSS) is what the sync converter bundles _and_ what the eventual `facility/` Next.js app imports.
- The **Tailwind preset** export carries tokens so app, Storybook, and rendered designs share one source of truth.

### Styling strategy (critical for both app-fit and sync fidelity)

Honor the blueprint's "Tailwind + CSS variables": the Tailwind preset exposes tokens as theme/utilities for layout, but the heavy material look (bezels, insets, enamel gradients, scanlines, hazard striping) lives in **token-driven CSS Modules**. This keeps the visual truth in CSS that ships in `dist/`, so it survives both `next build` and the design-sync style closure (rendered designs receive only `styles.css`'s transitive `@import` closure) — rather than depending on Tailwind's JIT seeing the JSX.

### Repo layout

```
ic-soviet-design-system/
├─ .storybook/                 # main.ts + preview.ts → "storybook shape" for /design-sync
├─ src/
│  ├─ tokens/
│  │  ├─ tokens.css            # single token source of truth
│  │  └─ tokens.ts             # typed token accessors + motion easing constants
│  ├─ styles/
│  │  └─ materials.css         # token-driven material/CRT/bezel utilities (ships in dist)
│  ├─ components/              # one folder per component: Component.tsx, .module.css, .stories.tsx, index.ts
│  ├─ icons/                   # engraved-style inline SVGs
│  ├─ hooks/                   # useReducedMotion, etc.
│  └─ index.ts                 # public barrel
├─ tailwind-preset.ts          # tokens → Tailwind theme/utilities (consumer-facing)
├─ fonts/                      # self-hosted display/data/body faces
├─ tsup.config.ts
├─ package.json                # exports: ".", "./preset", "./tokens.css", "./styles.css"
├─ tsconfig.json
├─ design-preview/tokens.html  # approved token sheet (preview artifact, not shipped)
├─ docs/superpowers/specs/     # this spec
└─ README.md
```

---

## 4. Token system

All tokens are CSS custom properties in `tokens.css` (single source of truth), mirrored as typed accessors + easing constants in `tokens.ts`, surfaced via the Tailwind preset. Validated against the approved preview at `design-preview/tokens.html`. Six layers:

**1 — Color = signal** (hard rule: color is meaning, never decoration).

- _World/neutral_ ramps: concrete grey; **enamel grey-green `#5b665c`** (anchor, 50–900 ramp); oxidized steel; rust; bone/ivory enamel; shadow black / void.
- _Signal/light_ roles (sparing, semantic): **`--signal-ambient`** sodium amber `#e8951f` (powered/occupied); **`--signal-decay`** dead-fluorescent green `#5fbf95`; **`--signal-active`** arc-blue `#3da9ff` (**active experiment only**); **`--signal-hazard`** emergency red `#dd2222` (**hazard only**); **`--signal-ok`** `#46c267`. Color is exposed to components only as a _role_, never a raw value — misuse is hard.

**2 — Typography** (3 roles, self-hosted, OFL/open, Latin+Cyrillic):

- Display/signage: **Saira Condensed** (DIN-adjacent industrial); **Stardos Stencil** for hazard plates — all-caps, tight.
- Data/readouts: **DSEG** (true 7-/14-segment) for gauges & nixie; **IBM Plex Mono** for terminal/dot-matrix.
- Body/liner notes: **IBM Plex Sans** (clean grotesk, state-technical heritage).

**3 — Material/surface** — reusable recipes: enamel finishes, brushed/corroded steel, hammered crinkle ("молотковая"), bevel + inset depths, rivets, edge-wear, recess-grime overlays. These drive the component CSS Modules. _Dirt lives in these tokens; the readable UI layer stays clean._

**4 — Geometry** — mostly hard machined corners (tiny radii), bezel/border widths, rivet sizes, an 8px panel grid.

**5 — Motion** — easing + durations: detent overshoot-then-settle (`--ease-detent`, ~700–1000ms rotation), switch _thunk_ (`--ease-thunk`, ~150–250ms), needle damped-settle (`--ease-needle`, ~900ms), LED warm-up/cool-down (`--ease-warm`, ~200–400ms) — each with a matched reduced-motion override.

**6 — Light/elevation** — machined, not soft: inset shadows, hard occlusion in recesses, backlight _glow_ only on active/signal states. Focus = hard machined outline, never a soft halo.

A concrete value reference is in Appendix A.

---

## 5. Component inventory & API conventions

~15 components in 4 Storybook groups (plus `Foundations/*` for tokens/type/materials/motion).

### `Controls/` — physical inputs

1. **`Panel`** — base surface every component sits in: `finish` (enamel/steel/concrete), `elevation` (raised/recessed/flush), optional rivets, title-plate slot, `hazardEdge`. The "designed by one ministry" substrate.
2. **`Switch`** — weighted toggle; `toggle | guarded (flip-cover) | three-position`; `role=switch`, keyboard.
3. **`Knob`** — rotary input with detents + ticks; controlled value/min/max/step; arrow-key slider semantics.
4. **`Button`** — machined pushbutton; `primary | secondary | danger`; press depth; icon slot; renders as `button`/`a`.
5. **`RotaryDial`** — indexed rotary _selector_ (N positions, detent click, `onChange(index)`). Control only; the app binds it to station routing. Desktop dial + compact mobile variant.

### `Displays/` — readouts

6. **`Gauge`** — analog needle, damped swing/settle; min/max, hazard zone, arc-blue active zone, unit label.
7. **`SegmentDisplay`** — DSEG 7-/14-seg / dot-matrix; flicker-on-change; `ambient | active` color.
8. **`Indicator`** (LED) — status lamp, warm-up/cool-down; semantic `signal` role; label.
9. **`CRTScreen`** — phosphor monitor _frame_: scanlines, bloom, curvature/vignette, green/amber phosphor, **content slot** (app drops in terminal/video). CSS treatment only — real-time PostFX stays in the cinematic layer.
10. **`MimicPanel`** — schematic line-diagram surface with live `Indicator` nodes; provides the grammar, app supplies the specific schematic.

### `Signage/` — identity

11. **`SignagePlate`** — enamel label plate; `cast (permanent) | stencil (semi) | taped (improvised)` tiers; icon slot; engraved/embossed text.
12. **`HazardStrip`** — diagonal caution/danger striping; severity + orientation.
13. **Icon set** (`icons/`) — ~6 engraved inline SVGs: trefoil, HV chevron, valve/flow, warning triangle, plus 1–2 more as needed. Exported as components.

### `Panels/` — composed proofs (slot shells, not page layouts)

14. **`StationPanel`** — canonical bezel assembly: title-plate (top-left) + primary-controls (center) + status (right) + hazard edge. Strongest proof of the ministry grammar; pure slots — the designer fills it.

_(Optional 15th: `Readout` — a labeled `SignagePlate` + `SegmentDisplay` composite. Build only if it proves useful during implementation.)_

### Shared API conventions

- **Color only via semantic role** — `signal?: 'ambient'|'decay'|'active'|'hazard'|'ok'`, never a raw color prop. Enforces "color = signal" at the type level.
- **Token-only styling** — no hardcoded colors/sizes; everything resolves to CSS vars, so re-theming = swap tokens.
- **Controlled + presentational** — interactive components take `value`/`checked`/`index` + `onChange`; none fetch data, route, or know content.
- **Reduced-motion built in** — every animated component self-degrades via `useReducedMotion()`; zero consumer config.
- **A11y baked** — real semantic elements + ARIA (switch/slider/button), full keyboard, hard machined `:focus-visible`.
- **Extensible** — `className`/`style` passthrough + `ref` forwarding + slots.
- Consistent `size?: 'sm'|'md'|'lg'`.

---

## 6. Motion & accessibility guarantees (DS-wide)

- **Reduced-motion:** under `prefers-reduced-motion: reduce`, needles jump to value, LEDs/segments go instant, flicker/idle-life stops, detent becomes a cross-fade. Built into every animated component, not opt-in.
- **Semantic spine + keyboard:** real elements + ARIA throughout; full keyboard operation; focus is a hard machined outline, never a soft glow.
- **SSR / no-JS safe:** every component renders meaningful static markup; animation/interaction is pure enhancement (the site is SSG-first and the design agent renders server-side).

---

## 7. Stories, verification & sync-readiness

**Storybook (8 + React-Vite):**

- One `.stories.tsx` per component covering **every variant and state** — including the full `signal` set, `disabled`, and a reduced-motion story — plus autodocs from the TS props (so the API the design agent codes against is exact).
- A **`Foundations/`** doc page mirrors the approved token sheet (colors, type, materials, motion).
- Interactive controls get **play functions** (toggle the switch, sweep the gauge) so behavior is demonstrably correct.

**Sync-readiness:**

- `.storybook/main.ts` + real stories ⇒ design-sync **"storybook shape"** (the high-fidelity path: each component preview verified against its own Storybook render before upload). A wrong-rendering component never reaches the design agent.
- `tsup` builds `dist/` as ESM + `.d.ts` + CSS; the `package.json` exports map (`.`, `./preset`, `./tokens.css`, `./styles.css`) serves both the sync bundle and the `facility/` app import.
- Material/skeuomorphic CSS ships **in `dist`** (not JIT-only Tailwind), so it survives the design-sync style closure that rendered designs receive.
- Write `design-sync.config.json` (`shape: "storybook"`, package path, scope) during scaffolding so the later upload is mostly deterministic.

---

## 8. Testing / CI gate (proportionate — visual library)

Gate = `tsc` typecheck **+** `tsup` build clean **+** `storybook build` succeeds **+** the play-function smoke run. No heavy unit suites; real verification is the Storybook render and the design-sync per-component grading.

---

## 9. Open decisions (resolve during implementation, none blocking)

- Final confirmation of self-hosted font files/weights (Saira Condensed, Stardos Stencil, DSEG, IBM Plex Sans/Mono) and their OFL license bundling.
- Whether the optional `Readout` composite earns its place.
- Exact `RotaryDial` mobile-variant ergonomics (dial vs. click-through selector) — physical control only; routing is the app's concern.

---

## Appendix A — token value reference

**Enamel grey-green ramp:** 50 `#eef0ee` · 100 `#d6dad6` · 200 `#b3bbb4` · 300 `#8d978f` · 400 `#707b73` · **500 `#5b665c`** · 600 `#4a544c` · 700 `#3b433d` · 800 `#2d332f` · 900 `#1f231f`

**Neutrals:** concrete `#c2c2bd`/`#63635d` · steel `#9aa1a3`/`#44494b` · rust `#6e5c4f` · bone `#e8e2d2`/`#d4c9b0` · shadow `#0c0d0c` · void `#030403`

**Signals:** ambient `#e8951f` · decay `#5fbf95` · active `#3da9ff` · hazard `#dd2222` · ok `#46c267`

**Motion curves:** `--ease-detent: cubic-bezier(.34,1.32,.5,1)` · `--ease-thunk: cubic-bezier(.7,0,.3,1)` · `--ease-needle: cubic-bezier(.22,1.2,.36,1)` · `--ease-warm: cubic-bezier(.4,0,.5,1)`
**Durations:** rotate 850ms · thunk 200ms · needle 900ms · warm 320ms

**Geometry:** radius machined 2px / panel 3px · bezel 2px · rivet 6px · grid 8px
