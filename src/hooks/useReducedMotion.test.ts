import { it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

function mockMM(matches: boolean) {
  window.matchMedia = (q: string) =>
    ({
      matches,
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return false;
      },
      onchange: null,
    }) as unknown as MediaQueryList;
}

it('true when reduce', () => {
  mockMM(true);
  expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
});

it('false otherwise', () => {
  mockMM(false);
  expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
});
