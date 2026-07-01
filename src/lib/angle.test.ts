import { describe, it, expect } from 'vitest';
import { valueToAngle, needleAngle } from './angle';

describe('valueToAngle', () => {
  it('maps min→-sweep/2, max→+sweep/2', () => {
    expect(valueToAngle(0, 0, 100, 270)).toBeCloseTo(-135);
    expect(valueToAngle(100, 0, 100, 270)).toBeCloseTo(135);
    expect(valueToAngle(50, 0, 100, 270)).toBeCloseTo(0);
  });
});

describe('needleAngle', () => {
  it('maps midpoint to 0 with a 180° sweep', () => {
    expect(needleAngle(50, 0, 100)).toBe(0);
  });
  it('maps endpoints to ±90', () => {
    expect(needleAngle(0, 0, 100)).toBeCloseTo(-90);
    expect(needleAngle(100, 0, 100)).toBeCloseTo(90);
  });
});
