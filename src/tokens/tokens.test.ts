import { describe, it, expect } from 'vitest';
import { ease, dur, signalVar } from './tokens';

describe('tokens', () => {
  it('exposes easing curve constants', () => {
    expect(ease.detent).toBe('cubic-bezier(.34,1.32,.5,1)');
    expect(ease.thunk).toBe('cubic-bezier(.7,0,.3,1)');
  });
  it('maps a Signal role to its css var', () => {
    expect(signalVar('active')).toBe('var(--signal-active)');
    expect(signalVar('hazard')).toBe('var(--signal-hazard)');
  });
  it('exposes durations in ms', () => {
    expect(dur.needle).toBe(900);
  });
});
