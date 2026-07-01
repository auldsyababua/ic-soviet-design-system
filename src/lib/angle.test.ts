import { describe, it, expect } from 'vitest';
import { valueToAngle, needleAngle } from './angle';

describe('valueToAngle', () => {
  // Canonical spec (Task 2.8)
  it('maps min→-sweep/2, max→+sweep/2, midpoint→0', () => {
    expect(valueToAngle(0, 0, 100, 270)).toBeCloseTo(-135);
    expect(valueToAngle(100, 0, 100, 270)).toBeCloseTo(135);
    expect(valueToAngle(50, 0, 100, 270)).toBeCloseTo(0);
  });

  it.each([
    // value, min, max, sweep, expected
    [25, 0, 100, 360, -90],
    [75, 0, 100, 360, 90],
    [50, 0, 100, 180, 0],
    [0, 0, 100, 180, -90],
    [0, -100, 100, 270, 0], // midpoint of a signed range
    [-100, -100, 100, 270, -135],
    [100, -100, 100, 270, 135],
  ])('valueToAngle(%p, %p, %p, %p) ≈ %p', (v, min, max, sweep, expected) => {
    expect(valueToAngle(v, min, max, sweep)).toBeCloseTo(expected);
  });

  it('is symmetric about the midpoint', () => {
    expect(valueToAngle(20, 0, 100, 270)).toBeCloseTo(-valueToAngle(80, 0, 100, 270));
  });

  it('does NOT clamp values outside [min,max] (callers clamp)', () => {
    expect(valueToAngle(150, 0, 100, 270)).toBeCloseTo(270); // 1.5·270 − 135
    expect(valueToAngle(-50, 0, 100, 270)).toBeCloseTo(-270);
  });

  it('guards a zero span (min === max) instead of returning NaN/Infinity', () => {
    const a = valueToAngle(5, 5, 5, 270);
    expect(a).toBe(0);
    expect(Number.isNaN(a)).toBe(false);
    expect(Number.isFinite(a)).toBe(true);
  });
});

describe('needleAngle', () => {
  // Canonical spec (Task 2.9)
  it('maps midpoint to 0 with a 180° sweep', () => {
    expect(needleAngle(50, 0, 100)).toBe(0);
  });
  it('maps endpoints to ±90', () => {
    expect(needleAngle(0, 0, 100)).toBeCloseTo(-90);
    expect(needleAngle(100, 0, 100)).toBeCloseTo(90);
  });

  it.each([
    [25, -45],
    [75, 45],
  ])('needleAngle(%p, 0, 100) ≈ %p', (v, expected) => {
    expect(needleAngle(v, 0, 100)).toBeCloseTo(expected);
  });

  it('is exactly valueToAngle with a 180° sweep', () => {
    for (const v of [0, 33, 50, 66, 100]) {
      expect(needleAngle(v, 0, 100)).toBe(valueToAngle(v, 0, 100, 180));
    }
  });

  it('guards a zero span', () => {
    expect(needleAngle(5, 5, 5)).toBe(0);
  });
});
