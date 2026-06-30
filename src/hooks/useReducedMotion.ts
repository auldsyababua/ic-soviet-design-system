import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const supported = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 * SSR-safe (defaults to `false` when no `window`/`matchMedia`), and subscribes
 * to changes so motion degrades live. Every animated component gates its motion
 * through this hook (belt) alongside a `@media (prefers-reduced-motion)` block
 * in its CSS (suspenders, for SSR/no-JS).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => (supported() ? window.matchMedia(QUERY).matches : false));

  useEffect(() => {
    if (!supported()) return;
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange); // Safari < 14
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  return reduced;
}
