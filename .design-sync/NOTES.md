# design-sync notes — THE FACILITY DS

- Shape: storybook (React-Vite). High-fidelity sync path.
- Material/skeuomorphic CSS ships in dist/styles.css (NOT JIT-only Tailwind) so it survives the rendered-design style closure.
- dist is self-contained: the tsup css pipeline copies fonts/ → dist/fonts/ and rewrites fonts.css url()s from ../../fonts/ (correct for the Storybook source import) to ./fonts/ for the shipped bundle. `files: ["dist"]` carries the faces, so a consumer importing @facility/ds/styles.css gets working @font-face — no system-font fallback.
- Brand-notes blurb for the claude.ai/design project lives in the spec §"brand notes" / chat history.
