import { it, expect, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

type Handler = () => void;

const realMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = realMatchMedia;
});

// Install a controllable matchMedia. `legacy` omits the modern add/removeEventListener
// methods so the hook must fall back to addListener/removeListener (Safari < 14).
function installMM(initial: boolean, { legacy = false } = {}) {
  let matches = initial;
  const handlers = new Set<Handler>();
  const mql: Record<string, unknown> = {
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    dispatchEvent: () => false,
    get matches() {
      return matches;
    },
  };
  if (legacy) {
    mql.addListener = (h: Handler) => {
      handlers.add(h);
    };
    mql.removeListener = (h: Handler) => {
      handlers.delete(h);
    };
  } else {
    mql.addEventListener = (_t: string, h: Handler) => {
      handlers.add(h);
    };
    mql.removeEventListener = (_t: string, h: Handler) => {
      handlers.delete(h);
    };
  }
  window.matchMedia = ((q: string) => {
    mql.media = q;
    return mql as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
  return {
    set(next: boolean) {
      matches = next;
      handlers.forEach((h) => h());
    },
    handlerCount: () => handlers.size,
  };
}

it('true when reduce', () => {
  installMM(true);
  expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
});

it('false otherwise', () => {
  installMM(false);
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
});

it('updates live when the preference changes', () => {
  const mm = installMM(false);
  const { result } = renderHook(() => useReducedMotion());
  expect(result.current).toBe(false);
  act(() => mm.set(true));
  expect(result.current).toBe(true);
  act(() => mm.set(false));
  expect(result.current).toBe(false);
});

it('uses the legacy addListener API and still updates', () => {
  const mm = installMM(true, { legacy: true });
  const { result } = renderHook(() => useReducedMotion());
  expect(result.current).toBe(true);
  act(() => mm.set(false));
  expect(result.current).toBe(false);
});

it('unsubscribes on unmount', () => {
  const mm = installMM(true);
  const { unmount } = renderHook(() => useReducedMotion());
  expect(mm.handlerCount()).toBe(1);
  unmount();
  expect(mm.handlerCount()).toBe(0);
});

it('is SSR-safe when matchMedia is unavailable', () => {
  // @ts-expect-error simulate a no-matchMedia environment (SSR / old runtime)
  window.matchMedia = undefined;
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
});
