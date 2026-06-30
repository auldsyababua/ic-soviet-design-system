import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';

// esbuild plugin: after the JS build, emit the GLOBAL CSS layers
// (tokens + fonts + materials) → dist/styles.css, and copy tokens.css →
// dist/tokens.css. This is the reusable, stable-named, theme + material layer
// the design-sync style closure depends on — shipped in dist/, not JIT Tailwind.
//
// NOTE: per-component CSS Modules are NOT concatenated here. esbuild scopes them
// (e.g. .btn → a hashed name) and emits dist/index.css matched to dist/index.js
// when the public barrel imports the components (Phase 6.1). Inlining the RAW
// source module css here would ship unscoped names that mismatch that JS — so the
// component layer is left to esbuild's scoped output, and Phase 6.3 decides whether
// styles.css should @import it for the rendered-design closure.
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
      const styles = [tokens, fonts, read('src/styles/materials.css')].join('\n');
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
  esbuildPlugins: [cssBundle],
});
