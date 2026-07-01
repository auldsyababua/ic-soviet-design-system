import { describe, it, expect } from 'vitest';
import { ease, dur, signalVar } from './tokens';
import type { Signal } from '../types';

describe('tokens', () => {
  describe('ease — easing curve constants (mirror of --ease-*)', () => {
    it.each([
      ['detent', 'cubic-bezier(.34,1.32,.5,1)'],
      ['thunk', 'cubic-bezier(.7,0,.3,1)'],
      ['needle', 'cubic-bezier(.22,1.2,.36,1)'],
      ['warm', 'cubic-bezier(.4,0,.5,1)'],
    ] as const)('ease.%s === %s', (key, value) => {
      expect(ease[key]).toBe(value);
    });
  });

  describe('dur — durations in ms (mirror of --dur-*)', () => {
    it.each([
      ['rotate', 850],
      ['thunk', 200],
      ['needle', 900],
      ['warm', 320],
    ] as const)('dur.%s === %p', (key, value) => {
      expect(dur[key]).toBe(value);
      expect(typeof dur[key]).toBe('number'); // unitless — callers append `ms`
    });
  });

  describe('signalVar — semantic role → css var', () => {
    const roles: Signal[] = ['ambient', 'decay', 'active', 'hazard', 'ok'];
    it.each(roles)('signalVar(%s) → var(--signal-%s)', (role) => {
      expect(signalVar(role)).toBe(`var(--signal-${role})`);
    });
  });
});
