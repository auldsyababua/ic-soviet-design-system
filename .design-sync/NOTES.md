# design-sync notes — THE FACILITY DS

- Shape: storybook (React-Vite). High-fidelity sync path.
- Material/skeuomorphic CSS ships in dist/styles.css (NOT JIT-only Tailwind) so it survives the rendered-design style closure.
- dist is self-contained: the tsup css pipeline copies fonts/ → dist/fonts/ and rewrites fonts.css url()s from ../../fonts/ (correct for the Storybook source import) to ./fonts/ for the shipped bundle. `files: ["dist"]` carries the faces, so a consumer importing @facility/ds/styles.css gets working @font-face — no system-font fallback.
- Brand-notes blurb for the claude.ai/design project lives in the spec §"brand notes" / chat history.

## Readiness (2026-07-02)

- **Storybook shape READY for /design-sync upload:** `.storybook/main.ts` present; all 15 components + `Foundations/Overview` have stories; Storybook builds green; play-function smoke-run passes (59). Per-component fidelity is verified against each component's own Vite-scoped Storybook render — the high-fidelity path the sync uses.
- `projectId` stays `null` until the upload step assigns it. The design system has NOT yet been synced at this version (the earlier cloud copy is a stale pre-Phase-3, CDN-font snapshot — re-run `/design-sync` against this repo to refresh it).
- **Known dist caveat (does NOT block the sync / the design agent):** the compiled `dist/index.css` currently uses unscoped CSS-module class names (esbuild identity naming), so generic names (`.label`, `.sm`, `.on`, …) collide across components in the npm/app-import path. Storybook is unaffected (Vite hashes them). Tracked as a separate build-system fix; relevant to the eventual Next.js app import (roadmap step 3), not to the design agent building from Storybook.
