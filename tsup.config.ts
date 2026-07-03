import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';

// esbuild plugin: after the JS build, emit the GLOBAL CSS layers
// (tokens + fonts + materials) → dist/styles.css, and copy tokens.css →
// dist/tokens.css. This is the reusable, stable-named, theme + material layer
// the design-sync style closure depends on — shipped in dist/, not JIT Tailwind.
//
// styles.css also @imports ./index.css (the SCOPED component layer esbuild emits),
// so a single `@facility/ds/styles.css` import carries the whole visual closure:
// tokens + fonts + materials + every component's CSS, with class names that match
// the locals maps in dist/index.js. The @import defers to the consumer's bundler /
// browser (resolved relative to dist/), so there is no build-time read-order coupling
// to when esbuild writes index.css.
//
// NOTE: per-component CSS Modules are NOT concatenated here. With loader['.css'] =
// 'local-css' (below), esbuild scopes them (e.g. .btn → .Button_btn — unique per
// component file) and emits dist/index.css matched to dist/index.js when the public
// barrel imports the components. Inlining the RAW source module css here would ship
// unscoped global names that mismatch that JS and collide across components (Button's
// .label vs Switch's .label) — so the component layer is left to esbuild's scoped
// output and pulled in via the @import above.
//
// dist/ must be self-contained: source fonts.css references ../../fonts/ (correct
// from src/styles/, which is what Storybook imports), but the SAME relative path
// would escape the package from dist/. So we copy fonts/ → dist/fonts/ and rewrite
// the url()s to ./fonts/ for the shipped bundle. `files: ["dist"]` then carries them.
const cssBundle = {
  name: 'facility-css-bundle',
  setup(build: { onEnd: (cb: () => void) => void }) {
    build.onEnd(() => {
      const root = process.cwd();
      const read = (rel: string) => readFileSync(join(root, rel), 'utf8');
      const tokens = read('src/tokens/tokens.css');
      const fonts = read('src/styles/fonts.css').replace(/\.\.\/\.\.\/fonts\//g, './fonts/');
      // @import must lead the file (CSS spec: only @charset/@layer may precede it).
      // ./index.css = the scoped component layer esbuild emits alongside index.js.
      const styles = ["@import './index.css';", tokens, fonts, read('src/styles/materials.css')].join('\n');
      const dist = join(root, 'dist');
      mkdirSync(dist, { recursive: true });
      writeFileSync(join(dist, 'styles.css'), styles);
      writeFileSync(join(dist, 'tokens.css'), tokens);
      cpSync(join(root, 'fonts'), join(dist, 'fonts'), { recursive: true });
    });
  },
};

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Route .css through esbuild's CSS-modules loader. tsup's built-in postcss plugin
  // otherwise returns loader:'css' (GLOBAL) for every .css — including .module.css —
  // which discards scoping: dist/index.js maps come out empty ({}) and dist/index.css
  // ships bare .btn/.label/.sm names that collide across components. 'local-css'
  // restores esbuild's per-file scoping (.btn → .Button_btn) and repopulates the maps.
  // Only component .module.css files reach esbuild here; the global token/font/material
  // layers are emitted by the raw-file-read cssBundle plugin and are unaffected.
  loader: { '.css': 'local-css' },
  esbuildPlugins: [cssBundle],
});
