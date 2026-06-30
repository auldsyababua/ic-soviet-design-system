import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
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
const cssBundle = {
  name: 'facility-css-bundle',
  setup(build: { onEnd: (cb: () => void) => void }) {
    build.onEnd(() => {
      const root = process.cwd();
      const read = (rel: string) => readFileSync(join(root, rel), 'utf8');
      const tokens = read('src/tokens/tokens.css');
      const layers = [tokens, read('src/styles/fonts.css'), read('src/styles/materials.css')];
      for (const file of collectModuleCss(join(root, 'src')).sort()) {
        layers.push(`/* ${file.slice(root.length + 1)} */\n${readFileSync(file, 'utf8')}`);
      }
      mkdirSync(join(root, 'dist'), { recursive: true });
      writeFileSync(join(root, 'dist/styles.css'), layers.join('\n'));
      writeFileSync(join(root, 'dist/tokens.css'), tokens);
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
