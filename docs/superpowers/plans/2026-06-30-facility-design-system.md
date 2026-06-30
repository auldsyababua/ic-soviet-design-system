# THE FACILITY Design System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `@facility/ds` — a Storybook-backed React + TypeScript control-panel design system (tokens + ~15 components) that uploads to claude.ai/design at high fidelity and is importable by the eventual FACILITY Next.js app.

**Architecture:** A standalone library (its own git repo at `ic-soviet-design-system/`) built with tsup → `dist/` (ESM + `.d.ts` + CSS), documented in Storybook 8 (React-Vite). Visual truth lives in token-driven CSS Modules + a `materials.css` layer that ships in `dist`; a Tailwind preset exposes the tokens for layout. Logic (token accessors, reduced-motion, value→angle/segment/index math) is factored into pure, unit-tested units the components consume.

**Tech Stack:** React 18 · TypeScript 5 · Storybook 8 (`@storybook/react-vite`) · Vite 5 · tsup 8 · Tailwind 3 (preset) + CSS Modules · Vitest (logic only) · `@storybook/test` (play functions) · pnpm · Node 22.

---

## Working context & conventions

- **Repo:** work directly in `ic-soviet-design-system/` (already its own git repo, `origin` = `github.com/auldsyababua/ic-soviet-design-system`, branch `main`). No worktree — the fresh repo is the isolation boundary. Push after each phase.
- **Source of truth:** the design spec at `docs/superpowers/specs/2026-06-30-facility-design-system-design.md`. The approved visual target is `design-preview/tokens.html` — open it side-by-side while building; components must read as that aesthetic.
- **Testing philosophy (spec §8):** proportionate. Vitest unit tests **only** for pure logic (token accessors, `useReducedMotion`, math utils). Visual components are verified by: `storybook build` succeeds, the component's stories render, and (for interactive ones) a `@storybook/test` play function passes. The full CI gate is `pnpm check` = `tsc --noEmit` + `tsup` build + `storybook build` + Vitest.
- **Commit cadence:** one commit per task (or per logical step where noted). Conventional messages, no AI attribution.

---

## Component Authoring Contract (every component task inherits this)

Each component lives in `src/components/<Name>/` with exactly:
```
<Name>.tsx          # the component
<Name>.module.css   # token-driven styling (no hardcoded colors/sizes)
<Name>.stories.tsx  # Storybook stories (variants/states matrix)
index.ts            # re-export
```

**Universal prop conventions** (defined once in `src/types.ts`, Task 1.0):
```ts
// src/types.ts
export type Signal = 'ambient' | 'decay' | 'active' | 'hazard' | 'ok';
export type Size = 'sm' | 'md' | 'lg';
```
Rules every component obeys:
- **Color only via `signal?: Signal`** — never a raw color prop. Maps to `--signal-*` tokens.
- **Token-only styling** — every color/space/radius/shadow in the `.module.css` references a `var(--…)` token. No literal hex, no literal px for themeable values.
- **Controlled + presentational** — interactive components take a value + `onChange`; none fetch data, route, or know content.
- **Forward `ref`, spread `className` + `style` + valid rest props** onto the root element.
- **Reduced-motion** — any animation is gated through the `useReducedMotion()` hook (Task 1.5) AND mirrored with a `@media (prefers-reduced-motion: reduce)` block in the `.module.css` (belt + suspenders, so SSR/no-JS is safe too).
- **A11y** — real semantic elements + ARIA; full keyboard; focus uses the `--focus-outline` token (hard machined outline).
- **Every component has these stories minimum:** `Default`, one story per meaningful variant, a `Signals` story iterating the full `Signal` set where applicable, `Disabled` where applicable, and `ReducedMotion` (rendered with the reduce media emulated). Autodocs on.

**Reference implementation (the concrete template) — `Button`** is fully worked in Task 2.2. Every later component task gives only its *unique* spec (props, structure, stories, verification) and says "follow the Contract + the Button template." This is a stable reference, not a cross-task "similar to."

---

## File structure map

```
ic-soviet-design-system/
├─ .storybook/{main.ts,preview.ts,preview-head.html}
├─ src/
│  ├─ types.ts                      # Signal, Size (Task 1.0)
│  ├─ tokens/{tokens.css,tokens.ts} # token source + typed accessors (1.1, 1.2)
│  ├─ styles/{fonts.css,materials.css}
│  ├─ hooks/useReducedMotion.ts     # (1.5)
│  ├─ lib/{segment.ts,angle.ts,index-wrap.ts}  # pure math utils (+ tests)
│  ├─ icons/{Trefoil.tsx,HighVoltage.tsx,ValveFlow.tsx,Warning.tsx,index.ts}
│  ├─ components/<Name>/...          # 15 components
│  ├─ foundations.stories.tsx        # Foundations doc page (1.6)
│  └─ index.ts                       # public barrel (6.1)
├─ fonts/                            # self-hosted woff2 + OFL licenses
├─ tailwind-preset.ts                # tokens → Tailwind theme/utilities
├─ tailwind.config.ts                # for Storybook/dev only
├─ tsup.config.ts · tsconfig.json · vitest.config.ts
├─ package.json                      # exports: ".","./preset","./tokens.css","./styles.css"
├─ design-sync.config.json · .design-sync/NOTES.md
└─ README.md (exists) · docs/ (exists) · design-preview/ (exists)
```

---

# PHASE 0 — Scaffold & tooling

### Task 0.1: package.json, deps, scripts

**Files:** Create `package.json`

- [ ] **Step 1: Write `package.json`**
```json
{
  "name": "@facility/ds",
  "version": "0.0.0",
  "private": false,
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./preset": "./tailwind-preset.ts",
    "./tokens.css": "./dist/tokens.css",
    "./styles.css": "./dist/styles.css"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "storybook": "storybook dev -p 6006 --no-open",
    "storybook:build": "storybook build",
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "check": "pnpm typecheck && pnpm build && pnpm test && pnpm storybook:build"
  },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" }
}
```

- [ ] **Step 2: Install deps**

Run:
```bash
cd /Users/colinaulds/Desktop/projects/ic-soviet-design-system
pnpm add -D react react-dom @types/react @types/react-dom typescript tsup vite \
  storybook@^8 @storybook/react-vite@^8 @storybook/addon-essentials@^8 @storybook/test@^8 \
  tailwindcss@^3 postcss autoprefixer @vitejs/plugin-react vitest jsdom @testing-library/react
```
Expected: installs cleanly, creates `node_modules` + `pnpm-lock.yaml`.

- [ ] **Step 3: Commit**
```bash
git add package.json pnpm-lock.yaml && git commit -m "chore: scaffold @facility/ds package and deps"
```

### Task 0.2: tsconfig, tsup, vitest, .gitignore

**Files:** Create `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`, `.gitignore`

- [ ] **Step 1: `.gitignore`**
```
node_modules/
dist/
storybook-static/
*.log
.DS_Store
```

- [ ] **Step 2: `tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020", "module": "ESNext", "moduleResolution": "Bundler",
    "jsx": "react-jsx", "strict": true, "declaration": true, "esModuleInterop": true,
    "skipLibCheck": true, "lib": ["ES2020","DOM","DOM.Iterable"], "types": ["vitest/globals"]
  },
  "include": ["src","tailwind-preset.ts"]
}
```

- [ ] **Step 3: `tsup.config.ts`** (emits ESM + d.ts; bundles CSS via the `loader`/`injectStyle:false` path so `tokens.css` and `styles.css` ship as files)
```ts
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'], dts: true, sourcemap: true, clean: true, external: ['react','react-dom'],
  // CSS Modules + global css are emitted; an esbuild css plugin (configured in Task 1.4)
  // concatenates tokens.css + fonts.css + materials.css + module css → dist/styles.css,
  // and copies tokens.css → dist/tokens.css.
});
```

- [ ] **Step 4: `vitest.config.ts`**
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'jsdom', globals: true } });
```

- [ ] **Step 5: Commit**
```bash
git add tsconfig.json tsup.config.ts vitest.config.ts .gitignore
git commit -m "chore: typescript, tsup, vitest, gitignore config"
```

### Task 0.3: Storybook (React-Vite) wired to tokens + Tailwind

**Files:** Create `.storybook/main.ts`, `.storybook/preview.ts`, `.storybook/preview-head.html`, `tailwind.config.ts`, `postcss.config.js`, `src/sb-tailwind.css`

- [ ] **Step 1: `.storybook/main.ts`**
```ts
import type { StorybookConfig } from '@storybook/react-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;
```

- [ ] **Step 2: `tailwind.config.ts` + `postcss.config.js` + `src/sb-tailwind.css`** (Tailwind is dev/Storybook-only; it consumes the preset from Task 0.4)
```ts
// tailwind.config.ts
import preset from './tailwind-preset';
export default { presets: [preset], content: ['./src/**/*.{ts,tsx,mdx}'] };
```
```js
// postcss.config.js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```
```css
/* src/sb-tailwind.css */
@tailwind base; @tailwind components; @tailwind utilities;
```

- [ ] **Step 3: `.storybook/preview.ts`** (import tokens + fonts + materials + tailwind so every story is themed; dark facility backdrop)
```ts
import '../src/tokens/tokens.css';
import '../src/styles/fonts.css';
import '../src/styles/materials.css';
import './sb-tailwind.css';
import type { Preview } from '@storybook/react';
const preview: Preview = {
  parameters: {
    backgrounds: { default: 'facility', values: [{ name: 'facility', value: '#060706' }] },
    controls: { expanded: true },
  },
};
export default preview;
```
(These imports reference files created in Phase 1; Storybook won't fully boot until then — that's expected and gated by Task 1.x.)

- [ ] **Step 4: Commit**
```bash
git add .storybook tailwind.config.ts postcss.config.js src/sb-tailwind.css
git commit -m "chore: storybook + tailwind wiring"
```

### Task 0.4: Tailwind preset skeleton

**Files:** Create `tailwind-preset.ts`

- [ ] **Step 1:** Skeleton that maps token CSS vars into Tailwind theme (filled out after tokens land; the values reference `var(--…)` so it stays a thin pass-through).
```ts
import type { Config } from 'tailwindcss';
const preset: Partial<Config> = {
  theme: { extend: {
    colors: {
      enamel: { 50:'var(--enamel-50)',500:'var(--enamel-500)',900:'var(--enamel-900)' },
      signal: {
        ambient:'var(--signal-ambient)', decay:'var(--signal-decay)',
        active:'var(--signal-active)', hazard:'var(--signal-hazard)', ok:'var(--signal-ok)',
      },
      shadow: 'var(--shadow)', void: 'var(--void)', bone: 'var(--bone-100)',
    },
    borderRadius: { machined:'var(--r-machined)', panel:'var(--r-panel)' },
    transitionTimingFunction: {
      detent:'var(--ease-detent)', thunk:'var(--ease-thunk)',
      needle:'var(--ease-needle)', warm:'var(--ease-warm)',
    },
  } },
};
export default preset;
```

- [ ] **Step 2: Commit**
```bash
git add tailwind-preset.ts && git commit -m "feat: tailwind preset skeleton mapping tokens"
```

### Task 0.5: design-sync config seed

**Files:** Create `design-sync.config.json`, `.design-sync/NOTES.md`

- [ ] **Step 1: `design-sync.config.json`**
```json
{
  "shape": "storybook",
  "projectId": null,
  "package": ".",
  "globalName": "FacilityDS",
  "storybookConfigDir": ".storybook"
}
```
(`projectId` filled when the claude.ai/design project is created during the upload step.)

- [ ] **Step 2: `.design-sync/NOTES.md`**
```md
# design-sync notes — THE FACILITY DS
- Shape: storybook (React-Vite). High-fidelity sync path.
- Material/skeuomorphic CSS ships in dist/styles.css (NOT JIT-only Tailwind) so it survives the rendered-design style closure.
- Brand-notes blurb for the claude.ai/design project lives in the spec §"brand notes" / chat history.
```

- [ ] **Step 3: Commit + push Phase 0**
```bash
git add design-sync.config.json .design-sync && git commit -m "chore: design-sync storybook-shape config seed"
git push
```

---

# PHASE 1 — Foundations

### Task 1.0: shared types

**Files:** Create `src/types.ts`

- [ ] **Step 1:** Write `Signal` + `Size` (see Contract). Commit `feat: shared Signal/Size types`.

### Task 1.1: tokens.css (all six layers)

**Files:** Create `src/tokens/tokens.css`

- [ ] **Step 1:** Port the full token set from the approved preview (`design-preview/tokens.html` `:root`) + spec Appendix A — the six layers: world/neutral ramps, signal roles, geometry, motion (`--ease-*`, `--dur-*`), light/elevation (`--inset-deep`,`--raise`,`--occlude`,`--focus-outline`), and material recipes (`--mat-enamel`,`--mat-steel`,`--mat-crinkle`,`--hazard-stripe`). Copy values verbatim from the preview so the look is identical.
- [ ] **Step 2: Verify** values match `design-preview/tokens.html` (diff the `:root` blocks).
- [ ] **Step 3: Commit** `feat(tokens): css-variable token source of truth`.

### Task 1.2: tokens.ts typed accessors + easing constants (TDD)

**Files:** Create `src/tokens/tokens.ts`, `src/tokens/tokens.test.ts`

- [ ] **Step 1: Failing test** `src/tokens/tokens.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { ease, dur, signalVar } from './tokens';
describe('tokens', () => {
  it('exposes easing curve constants', () => {
    expect(ease.detent).toBe('cubic-bezier(.34,1.32,.5,1)');
    expect(ease.thunk).toBe('cubic-bezier(.7,0,.3,1)');
  });
  it('maps a Signal role to its css var', () => {
    expect(signalVar('active')).toBe('var(--signal-active)');
    expect(signalVar('hazard')).toBe('var(--signal-hazard)');
  });
  it('exposes durations in ms', () => { expect(dur.needle).toBe(900); });
});
```
- [ ] **Step 2: Run** `pnpm test src/tokens/tokens.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement** `src/tokens/tokens.ts`
```ts
import type { Signal } from '../types';
export const ease = {
  detent: 'cubic-bezier(.34,1.32,.5,1)', thunk: 'cubic-bezier(.7,0,.3,1)',
  needle: 'cubic-bezier(.22,1.2,.36,1)', warm: 'cubic-bezier(.4,0,.5,1)',
} as const;
export const dur = { rotate: 850, thunk: 200, needle: 900, warm: 320 } as const;
export const signalVar = (s: Signal) => `var(--signal-${s})`;
```
- [ ] **Step 4: Run** → PASS. **Step 5: Commit** `feat(tokens): typed accessors + easing constants`.

### Task 1.3: self-hosted fonts

**Files:** Create `fonts/*.woff2`, `fonts/OFL-*.txt`, `src/styles/fonts.css`

- [ ] **Step 1:** Fetch woff2 for Saira Condensed (400/600/800), Stardos Stencil (400/700), IBM Plex Sans (400/500/600/700), IBM Plex Mono (400/500), and DSEG7/DSEG14 Classic. Sources: google-webfonts-helper (or `npm pack` the `@fontsource/*` packages) for the Google faces; the `dseg` npm package for DSEG. Save woff2 into `fonts/` and the matching OFL license text alongside.
- [ ] **Step 2:** `src/styles/fonts.css` — `@font-face` blocks pointing at `../../fonts/*.woff2` with `font-display: swap`. Define families: `'Saira Condensed'`, `'Stardos Stencil'`, `'IBM Plex Sans'`, `'IBM Plex Mono'`, `'DSEG7 Classic'`, `'DSEG14 Classic'`.
- [ ] **Step 3: Verify** in Storybook (after 1.6) the Foundations type specimens render in the real faces, not fallbacks.
- [ ] **Step 4: Commit** `feat(fonts): self-host display/data/body faces + OFL licenses`.

### Task 1.4: materials.css + tsup CSS pipeline

**Files:** Create `src/styles/materials.css`; Modify `tsup.config.ts`

- [ ] **Step 1:** `materials.css` — utility classes wrapping the material recipes as reusable, token-driven helpers: `.mat-enamel`, `.mat-steel`, `.mat-crinkle`, `.bezel`, `.inset`, `.occlude`, `.hazard-stripe`, `.scanlines`, `.rivets`. Each uses only `var(--…)` from tokens.css.
- [ ] **Step 2:** Add an esbuild CSS-bundling step to `tsup.config.ts` (`esbuildPlugins`) that, on build end, concatenates `tokens.css + fonts.css + materials.css + all *.module.css` → `dist/styles.css`, and copies `tokens.css` → `dist/tokens.css`. (CSS Modules keep scoped class names; the concatenation preserves them.)
- [ ] **Step 3: Verify** `pnpm build` emits `dist/styles.css` and `dist/tokens.css`; grep `dist/styles.css` for `--enamel-500` and `.mat-crinkle`.
- [ ] **Step 4: Commit** `feat(styles): materials layer + dist css pipeline`.

### Task 1.5: useReducedMotion hook (TDD)

**Files:** Create `src/hooks/useReducedMotion.ts`, `src/hooks/useReducedMotion.test.ts`

- [ ] **Step 1: Failing test** — mock `matchMedia` returning `matches:true`, assert hook returns `true`; returning `false`, assert `false`.
```ts
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';
function mockMM(matches: boolean){ window.matchMedia = (q:string)=>({matches,media:q,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){},dispatchEvent(){return false;},onchange:null}) as any; }
it('true when reduce', ()=>{ mockMM(true); expect(renderHook(()=>useReducedMotion()).result.current).toBe(true); });
it('false otherwise', ()=>{ mockMM(false); expect(renderHook(()=>useReducedMotion()).result.current).toBe(false); });
```
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** (subscribe to `(prefers-reduced-motion: reduce)`, SSR-safe default `false`). **Step 4: Run** → PASS. **Step 5: Commit** `feat(hooks): useReducedMotion`.

### Task 1.6: Foundations Storybook doc page

**Files:** Create `src/foundations.stories.tsx`

- [ ] **Step 1:** A `Foundations/Overview` story that renders: the color ramps + signal lamps, the four type specimens, the material swatches, and the motion curve names — mirroring `design-preview/tokens.html` but consuming the real tokens/fonts. (This doubles as the human-facing "does the look survive in the package" check.)
- [ ] **Step 2: Verify** `pnpm storybook:build` succeeds and the Foundations page renders in the real faces/tokens.
- [ ] **Step 3: Commit + push Phase 1** `docs(foundations): token/type/material/motion storybook page` + `git push`.

---

# PHASE 2 — Atomic controls, displays & signage

> Build order respects dependencies: icons → HazardStrip → Panel → Button → Switch → Indicator → SignagePlate → SegmentDisplay (+util) → Knob (+util) → Gauge (+util). Each follows the Component Authoring Contract.

### Task 2.0: icon set

**Files:** Create `src/icons/{Trefoil,HighVoltage,ValveFlow,Warning}.tsx`, `src/icons/index.ts`

- [ ] **Step 1:** Four inline-SVG icon components, engraved style (two-tone: dark engrave + light highlight via `currentColor` + a `--bone` stroke). Props: `size?: number` (default 24), `title?: string` (a11y), spread rest. `aria-hidden` when no title.
- [ ] **Step 2:** `index.ts` barrel.
- [ ] **Step 3: Story** `Signage/Icons` rendering all four at 24/48px on enamel.
- [ ] **Step 4: Verify** storybook renders. **Step 5: Commit** `feat(icons): engraved trefoil/HV/valve/warning set`.

### Task 2.1: HazardStrip

**Files:** Create `src/components/HazardStrip/{HazardStrip.tsx,.module.css,.stories.tsx,index.ts}`

- [ ] **Step 1: Props**
```ts
export interface HazardStripProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: 'caution' | 'danger';   // caution=amber/black, danger=red/black
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;                // px, default 14
}
```
- [ ] **Step 2:** Implement per Contract + Button template: a `<div role="presentation">` painted with `--hazard-stripe` (caution) or a red variant token; orientation flips stripe angle/size. No motion.
- [ ] **Step 3: Stories:** `Default`, `Danger`, `Vertical`, `Thick`.
- [ ] **Step 4: Verify** storybook render matches the preview's hazard swatch. **Step 5: Commit** `feat(HazardStrip)`.

### Task 2.2: Button — REFERENCE IMPLEMENTATION (the template)

**Files:** Create `src/components/Button/{Button.tsx,.module.css,.stories.tsx,index.ts}`

- [ ] **Step 1: Props**
```ts
import type { Signal, Size } from '../../types';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: Size;
  signal?: Signal;            // optional backlight tint when "armed"
  icon?: React.ReactNode;     // engraved icon slot
}
```
- [ ] **Step 2: `Button.tsx`** (full template — forward ref, rest spread, token classes, machined press + focus)
```tsx
import { forwardRef } from 'react';
import styles from './Button.module.css';
import type { ButtonProps } from './types-or-inline';
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant='primary', size='md', signal, icon, className='', children, style, ...rest }, ref) {
  return (
    <button ref={ref}
      className={[styles.btn, styles[variant], styles[size], className].join(' ')}
      style={{ ...(signal ? { ['--armed' as any]: `var(--signal-${signal})` } : {}), ...style }}
      {...rest}>
      {icon && <span className={styles.icon} aria-hidden>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  );
});
```
- [ ] **Step 3: `Button.module.css`** (full template — every value a token; machined press depth; hard focus; reduced-motion)
```css
.btn{ font-family:'Saira Condensed',sans-serif; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
  color:var(--bone-100); background:var(--mat-enamel); border:1px solid var(--enamel-800);
  border-radius:var(--r-machined); box-shadow:var(--raise); cursor:pointer;
  display:inline-flex; align-items:center; gap:8px; padding:8px 16px; transition:box-shadow var(--dur-thunk)ms var(--ease-thunk), transform var(--dur-thunk)ms var(--ease-thunk); }
.btn:active{ box-shadow:var(--inset-deep); transform:translateY(1px); }
.btn:focus-visible{ outline:none; box-shadow:var(--raise), var(--focus-outline); }
.primary{} .secondary{ background:var(--mat-steel); } .danger{ color:var(--signal-hazard-bright); border-color:var(--signal-hazard); }
.sm{ padding:6px 12px; font-size:12px } .md{ padding:8px 16px; font-size:13px } .lg{ padding:11px 22px; font-size:15px }
.icon{ display:inline-flex } .label{ display:inline-block }
@media (prefers-reduced-motion: reduce){ .btn{ transition:none } }
```
- [ ] **Step 4: `Button.stories.tsx`** (full template — the canonical story shape every component copies)
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { Button } from './Button';
const meta: Meta<typeof Button> = { title: 'Controls/Button', component: Button, tags:['autodocs'] };
export default meta; type S = StoryObj<typeof Button>;
export const Default: S = { args: { children: 'INITIATE' } };
export const Secondary: S = { args: { variant:'secondary', children:'STANDBY' } };
export const Danger: S = { args: { variant:'danger', children:'SCRAM' } };
export const Sizes: S = { render: () => <div style={{display:'flex',gap:12}}>
  <Button size="sm">SM</Button><Button size="md">MD</Button><Button size="lg">LG</Button></div> };
export const Disabled: S = { args: { children:'LOCKED', disabled:true } };
export const ReducedMotion: S = { args:{children:'NO MOTION'}, parameters:{ /* emulate reduce */ } };
export const Click: S = { args: { children:'TEST', onClick: fn() },
  play: async ({ canvasElement, args }) => { await userEvent.click(within(canvasElement).getByRole('button')); await expect(args.onClick).toHaveBeenCalled(); } };
```
- [ ] **Step 5: Verify** `pnpm storybook:build`; the `Click` play passes; visual matches the preview's machined button. **Step 6: Commit** `feat(Button): reference component + canonical story/play pattern`.

### Task 2.3: Panel

**Files:** `src/components/Panel/{...}`

- [ ] **Step 1: Props**
```ts
export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  finish?: 'enamel' | 'steel' | 'concrete';
  elevation?: 'raised' | 'recessed' | 'flush';
  rivets?: boolean;
  hazardEdge?: 'none' | 'top' | 'bottom' | 'left' | 'right';
  title?: React.ReactNode;     // renders in an engraved top-left title-plate slot
}
```
- [ ] **Step 2:** Implement per Contract+template. Root `<section>`; finish → `--mat-*`; elevation → `--raise`/`--inset-deep`/none; `rivets` → `.rivets` overlay; `hazardEdge` renders a `<HazardStrip>` (Task 2.1) on the chosen edge; `title` renders a Saira-Condensed engraved plate top-left. `children` is the panel body.
- [ ] **Step 3: Stories:** `Default`, `Steel`, `Concrete`, `Recessed`, `WithRivets`, `HazardEdge`, `Titled`.
- [ ] **Step 4: Verify** render; the enamel+rivets matches the preview material swatch. **Step 5: Commit** `feat(Panel): base surface/bezel substrate`.

### Task 2.4: Switch

**Files:** `src/components/Switch/{...}`

- [ ] **Step 1: Props**
```ts
export interface SwitchProps {
  checked: boolean; onChange: (next: boolean) => void;
  kind?: 'toggle' | 'guarded' | 'three-position';
  position?: -1 | 0 | 1;        // for three-position; ignored otherwise
  size?: Size; label?: string; disabled?: boolean;
  className?: string; style?: React.CSSProperties;
}
```
- [ ] **Step 2:** Implement per Contract+template. Root is a real `<button role="switch" aria-checked>` (toggle/guarded) or a radiogroup (three-position). Lever throws with `--ease-thunk`; `guarded` adds a flip-cover that must lift first. Keyboard: Space/Enter toggles; arrows for three-position. Reduced-motion → instant throw.
- [ ] **Step 3: Stories:** `Default`(off/on via args), `Guarded`, `ThreePosition`, `Sizes`, `Disabled`, `ReducedMotion`, + a `Throw` play (click → `onChange` called, `aria-checked` flips).
- [ ] **Step 4: Verify** play passes; throw matches preview switch demo. **Step 5: Commit** `feat(Switch): weighted toggle/guarded/three-position`.

### Task 2.5: Indicator (LED)

**Files:** `src/components/Indicator/{...}`

- [ ] **Step 1: Props**
```ts
export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  signal?: Signal; on?: boolean; label?: string; size?: Size;
}
```
- [ ] **Step 2:** Implement per Contract+template. A lamp `<span role="img" aria-label>` with inset-dark when off; when `on`, fills `var(--signal-…)` with a backlight glow that **warms up** via `--ease-warm`. Reduced-motion → instant. `label` renders an adjacent IBM-Plex-Mono caption.
- [ ] **Step 3: Stories:** `Default`, `Signals` (iterate all five roles, on), `Off`, `Sizes`, `WithLabel`, `ReducedMotion`.
- [ ] **Step 4: Verify** matches preview lamps. **Step 5: Commit** `feat(Indicator): warm-up status LED`.

### Task 2.6: SignagePlate

**Files:** `src/components/SignagePlate/{...}`

- [ ] **Step 1: Props**
```ts
export interface SignagePlateProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: 'cast' | 'stencil' | 'taped';
  icon?: React.ReactNode;       // from src/icons
  severity?: 'none' | 'caution' | 'danger';
}
```
- [ ] **Step 2:** Implement per Contract+template. `cast` → engraved/embossed enamel plate (Saira Condensed); `stencil` → Stardos Stencil on metal; `taped` → handwritten-ish improvised label. `icon` slot left; `severity` tints text/edge via signal tokens. `children` is the label text.
- [ ] **Step 3: Stories:** `Cast`, `Stencil`, `Taped`, `WithIcon`(Trefoil), `Danger`.
- [ ] **Step 4: Verify** matches preview signage type specimens. **Step 5: Commit** `feat(SignagePlate): cast/stencil/taped label plates`.

### Task 2.7: SegmentDisplay (+ pure util, TDD)

**Files:** `src/lib/segment.ts`, `src/lib/segment.test.ts`, `src/components/SegmentDisplay/{...}`

- [ ] **Step 1: Failing test** `segment.test.ts` for `formatSegments(value, digits)`:
```ts
import { formatSegments } from './segment';
it('right-pads/truncates to digit count', () => {
  expect(formatSegments(42, 4)).toBe('  42');
  expect(formatSegments(13800, 4)).toBe('3800'); // overflow keeps low digits
});
it('renders strings (e.g. time) verbatim within width', () => {
  expect(formatSegments('03:42', 5)).toBe('03:42');
});
```
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** `formatSegments`. **Step 4: Run** → PASS.
- [ ] **Step 5: Props + component**
```ts
export interface SegmentDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | number; digits?: number;
  variant?: 'seg7' | 'seg14' | 'dotmatrix';
  signal?: Extract<Signal,'ambient'|'active'>;   // phosphor color
}
```
Implement per Contract+template: a ghost-segment underlay (the unlit "8"s) + the lit value over it using `'DSEG7/14 Classic'`; `dotmatrix` uses IBM Plex Mono. Value change flickers via a brief `--ease-warm` opacity dip (reduced-motion → instant).
- [ ] **Step 6: Stories:** `Seg7`, `Seg14`, `DotMatrix`, `Ambient`, `Active`, `Clock`(03:42:17), `ReducedMotion`.
- [ ] **Step 7: Verify** matches preview readout specimens. **Step 8: Commit** `feat(SegmentDisplay): DSEG 7/14/dot-matrix readout`.

### Task 2.8: Knob (+ pure util, TDD)

**Files:** `src/lib/angle.ts`, `src/lib/angle.test.ts`, `src/components/Knob/{...}`

- [ ] **Step 1: Failing test** `angle.test.ts` for `valueToAngle(value, min, max, sweep)`:
```ts
import { valueToAngle } from './angle';
it('maps min→-sweep/2, max→+sweep/2', () => {
  expect(valueToAngle(0,0,100,270)).toBeCloseTo(-135);
  expect(valueToAngle(100,0,100,270)).toBeCloseTo(135);
  expect(valueToAngle(50,0,100,270)).toBeCloseTo(0);
});
```
- [ ] **Step 2:** FAIL → **Step 3:** implement → **Step 4:** PASS.
- [ ] **Step 5: Props + component**
```ts
export interface KnobProps {
  value: number; onChange: (v:number)=>void; min?: number; max?: number; step?: number;
  detents?: number; size?: Size; label?: string; disabled?: boolean;
  className?: string; style?: React.CSSProperties;
}
```
Implement per Contract+template: a bakelite knob (`role="slider"` aria-valuemin/max/now) rotated by `valueToAngle`, tick marks, detent snap; keyboard arrows step; reduced-motion → instant rotate.
- [ ] **Step 6: Stories:** `Default`, `Detented`, `Sizes`, `WithLabel`, `Disabled`, + `Keyboard` play (ArrowUp → `onChange`).
- [ ] **Step 7: Verify** play passes. **Step 8: Commit** `feat(Knob): detented rotary input`.

### Task 2.9: Gauge (+ pure util reuse, TDD)

**Files:** `src/components/Gauge/{...}`, extend `src/lib/angle.test.ts`

- [ ] **Step 1: Failing test:** add `needleAngle(value,min,max)` (180° sweep) to `angle.ts` with a test (`needleAngle(50,0,100)===0`, endpoints ±90).
- [ ] **Step 2:** FAIL → implement → PASS.
- [ ] **Step 3: Props + component**
```ts
export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; min?: number; max?: number; unit?: string; size?: Size;
  hazardFrom?: number;     // start of red zone
  activeFrom?: number;     // start of arc-blue zone
  label?: string;
}
```
Implement per Contract+template: SVG dial with neutral arc + optional arc-blue active zone + red hazard zone; needle (`role="meter"` aria-valuenow) animates to `needleAngle(value)` via `--ease-needle` with damped settle; reduced-motion → jumps. Numeric readout under the dial reuses `SegmentDisplay`.
- [ ] **Step 4: Stories:** `Default`, `WithHazardZone`, `WithActiveZone`, `Sizes`, `Sweep` (play: set value, assert needle transform/aria-valuenow), `ReducedMotion`.
- [ ] **Step 5: Verify** matches preview needle demo. **Step 6: Commit + push Phase 2** `feat(Gauge): analog needle dial` + `git push`.

---

# PHASE 3 — Composed displays

### Task 3.1: CRTScreen

**Files:** `src/components/CRTScreen/{...}`

- [ ] **Step 1: Props**
```ts
export interface CRTScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  phosphor?: 'green' | 'amber'; curvature?: boolean; size?: Size;
  // children = the screen content slot (terminal text, <video>, etc.)
}
```
- [ ] **Step 2:** Implement per Contract+template, composing `Panel` (steel bezel) + a screen surface with `.scanlines`, bloom, optional curvature/vignette, phosphor tint. **CSS treatment only** — no WebGL. `children` render inside the screen area. Idle scanline shimmer gated by reduced-motion.
- [ ] **Step 3: Stories:** `Green`, `Amber`, `Curved`, `WithTerminalText`, `WithSegmentReadout`, `ReducedMotion`.
- [ ] **Step 4: Verify** the scanline/phosphor reads like a CRT; content slot legible. **Step 5: Commit** `feat(CRTScreen): phosphor monitor frame + content slot`.

### Task 3.2: MimicPanel

**Files:** `src/components/MimicPanel/{...}`

- [ ] **Step 1: Props**
```ts
export interface MimicNode { id: string; x: number; y: number; signal?: Signal; on?: boolean; label?: string; }
export interface MimicEdge { from: string; to: string; }
export interface MimicPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: MimicNode[]; edges: MimicEdge[]; size?: Size;
}
```
- [ ] **Step 2:** Implement per Contract+template: a `Panel` hosting an SVG schematic — `edges` as engraved lines between node coords, `nodes` as `Indicator`s positioned at (x,y). Provides the grammar; the app supplies the specific topology via props.
- [ ] **Step 3: Stories:** `Default` (a small reactor-cooling schematic), `AllActive`, `WithHazard`.
- [ ] **Step 4: Verify** lines + live nodes render coherently. **Step 5: Commit + push** `feat(MimicPanel): live schematic surface` + `git push`.

---

# PHASE 4 — Composed proof

### Task 4.1: StationPanel

**Files:** `src/components/StationPanel/{...}`

- [ ] **Step 1: Props**
```ts
export interface StationPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;        // engraved SignagePlate, top-left
  status?: React.ReactNode;      // Indicator cluster slot, right
  hazard?: boolean;              // hazard strip along the danger edge
  children: React.ReactNode;     // primary controls, center
}
```
- [ ] **Step 2:** Implement per Contract+template as a slot shell composing `Panel` + `SignagePlate` (title) + a center `children` region + a right `status` region + optional `HazardStrip`. Pure layout — fills with whatever the designer passes. This is the "one ministry" grammar proof.
- [ ] **Step 3: Stories:** `Default` (title + a couple of Switches/Gauge + status LEDs + hazard), `NoHazard`, `Dense`.
- [ ] **Step 4: Verify** the assembled station reads as a coherent control desk. **Step 5: Commit + push** `feat(StationPanel): canonical station bezel assembly` + `git push`.

---

# PHASE 5 — Complex control

### Task 5.1: RotaryDial (+ pure util, TDD)

**Files:** `src/lib/index-wrap.ts`, `src/lib/index-wrap.test.ts`, `src/components/RotaryDial/{...}`

- [ ] **Step 1: Failing test** `index-wrap.test.ts` for `stepIndex(current, delta, count, wrap)`:
```ts
import { stepIndex } from './index-wrap';
it('advances and clamps or wraps', () => {
  expect(stepIndex(3,1,4,false)).toBe(3);          // clamp at last
  expect(stepIndex(3,1,4,true)).toBe(0);           // wrap
  expect(stepIndex(0,-1,4,true)).toBe(3);
});
```
- [ ] **Step 2:** FAIL → implement → PASS.
- [ ] **Step 3: Props + component**
```ts
export interface RotaryDialProps {
  positions: { id: string; label: string }[];
  index: number; onChange: (index: number) => void;
  variant?: 'dial' | 'compact';   // desktop dial vs mobile click-through selector
  wrap?: boolean; size?: Size; className?: string; style?: React.CSSProperties;
}
```
Implement per Contract+template: `dial` = a detented rotary pointer (`role="radiogroup"`, each position a radio) that snaps to the selected facing via `--ease-detent` overshoot-settle; `compact` = a horizontal click-through selector. Keyboard arrows call `stepIndex`. The control only emits `onChange(index)`; routing is the app's job. Reduced-motion → instant snap.
- [ ] **Step 4: Stories:** `Dial` (8 stations), `Compact`, `Wrap`, `Keyboard` play (Arrow → `onChange` with expected index), `ReducedMotion`.
- [ ] **Step 5: Verify** play passes; detent feel matches the rotation spec. **Step 6: Commit + push** `feat(RotaryDial): indexed station selector` + `git push`.

---

# PHASE 6 — Barrel, gate, polish

### Task 6.1: public barrel + exports

**Files:** Create `src/index.ts`; verify `package.json` exports

- [ ] **Step 1:** `src/index.ts` re-exports every component, the icon set, `useReducedMotion`, `ease`/`dur`/`signalVar`, and the `Signal`/`Size` types. Re-export nothing internal-only (`lib/*` math stays internal).
- [ ] **Step 2:** `pnpm build`; confirm `dist/index.d.ts` lists all public symbols and `dist/styles.css`/`dist/tokens.css` exist.
- [ ] **Step 3: Commit** `feat: public barrel export`.

### Task 6.2: CI gate green + README usage

**Files:** Modify `README.md`; (optional) `.github/workflows/ci.yml`

- [ ] **Step 1:** Run `pnpm check` — fix anything until **typecheck + build + vitest + storybook:build all pass clean**.
- [ ] **Step 2:** Update `README.md` Status table → mark package/Storybook ✅; add an Install + Usage section (`pnpm add @facility/ds`, import `@facility/ds/styles.css` + the Tailwind preset, a `<StationPanel>` example).
- [ ] **Step 3:** (Optional) add a GitHub Actions workflow running `pnpm check` on push.
- [ ] **Step 4: Commit + push** `chore: green CI gate + README usage` + `git push`.

### Task 6.3: design-sync readiness checkpoint

**Files:** Modify `design-sync.config.json`, `.design-sync/NOTES.md`

- [ ] **Step 1:** Confirm the repo is the storybook shape the sync expects: `.storybook/main.ts` present, every component has stories, `dist/styles.css` carries the material CSS. Note any per-component quirks in `.design-sync/NOTES.md`.
- [ ] **Step 2:** Leave `projectId: null` (filled at upload). Commit `chore: confirm design-sync storybook-shape readiness`.
- [ ] **Step 3:** STOP — hand back for the **upload step** (run `/design-sync` against this repo), which is a separate workflow, not part of this build plan.

### Task 6.4: (optional) Readout composite

- [ ] Only if it earned its place during the build: a labeled `SignagePlate` + `SegmentDisplay` composite, same Contract, with `Default`/`Signals` stories. Otherwise skip and note "not built — designer composes from SignagePlate+SegmentDisplay" in `.design-sync/NOTES.md`.

---

## Self-review

- **Spec coverage:** Foundations §4 → Phase 1 (1.1–1.6). All 15 components §5 → Tasks 2.0–5.1 (Panel, Switch, Knob, Button, RotaryDial, Gauge, SegmentDisplay, Indicator, CRTScreen, MimicPanel, SignagePlate, HazardStrip, icons, StationPanel; optional Readout 6.4). API conventions §5 → Contract. Motion/a11y §6 → Contract + per-component reduced-motion/play steps. Stories/verification/sync §7 → Contract stories + 6.3. CI gate §8 → `pnpm check` (0.1, 6.2). Architecture §3 → Phase 0. No gaps.
- **Placeholder scan:** All interfaces are concrete; verification steps have exact commands; the only deferred item (Readout) is explicitly optional with a recorded fallback. Visual CSS is specified by structure + tokens + the approved preview as target (intentional — not a vague placeholder).
- **Type consistency:** `Signal`/`Size` defined once (1.0) and reused everywhere; util names (`formatSegments`, `valueToAngle`, `needleAngle`, `stepIndex`) match between their test, impl, and consumer tasks; `useReducedMotion`, `ease`/`dur`/`signalVar` referenced consistently.

---

## Execution handoff

See the chat — choose subagent-driven (recommended) vs inline execution.
