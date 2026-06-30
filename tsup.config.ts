import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';

// Collect every component CSS Module under src/ (recursively). Their scoped
// class names are preserved by concatenation.
function collectModuleCss(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) collectModuleCss(p, acc);
    else if (entry.endsWith('.module.css')) acc.push(p);
  }
  return acc;
}

// esbuild plugin: after the JS build, concatenate the global CSS layers +
// all component module css into dist/styles.css, and copy tokens.css →
// dist/tokens.css. Keeps the visual truth in CSS that ships in dist/ (so it
// survives `next build` and the design-sync style closure), not JIT Tailwind.
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
      const layers = [tokens, fonts, read('src/styles/materials.css')];
      for (const file of collectModuleCss(join(root, 'src')).sort()) {
        layers.push(`/* ${file.slice(root.length + 1)} */\n${readFileSync(file, 'utf8')}`);
      }
      const dist = join(root, 'dist');
      mkdirSync(dist, { recursive: true });
      writeFileSync(join(dist, 'styles.css'), layers.join('\n'));
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
