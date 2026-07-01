import { describe, it, expect } from 'vitest';
import { stepIndex } from './index-wrap';

describe('stepIndex', () => {
  // Canonical spec (Task 5.1)
  it('advances and clamps or wraps', () => {
    expect(stepIndex(3, 1, 4, false)).toBe(3); // clamp at last
    expect(stepIndex(3, 1, 4, true)).toBe(0); // wrap
    expect(stepIndex(0, -1, 4, true)).toBe(3);
  });

  it('advances within range without hitting an edge', () => {
    expect(stepIndex(0, 1, 4, false)).toBe(1);
    expect(stepIndex(1, 1, 4, true)).toBe(2);
    expect(stepIndex(2, -1, 4, false)).toBe(1);
  });

  it('clamps at the low end when wrap is false', () => {
    expect(stepIndex(0, -1, 4, false)).toBe(0);
  });

  it('wraps repeatedly / by more than one step', () => {
    expect(stepIndex(0, -1, 3, true)).toBe(2);
    expect(stepIndex(2, 2, 3, true)).toBe(1); // (2+2)%3 = 1
    expect(stepIndex(0, 5, 3, true)).toBe(2); // (0+5)%3 = 2
  });

  it('clamps a delta larger than the remaining range when wrap is false', () => {
    expect(stepIndex(0, 5, 3, false)).toBe(2);
    expect(stepIndex(2, -5, 3, false)).toBe(0);
  });

  it('handles a single-position dial', () => {
    expect(stepIndex(0, 1, 1, true)).toBe(0);
    expect(stepIndex(0, 1, 1, false)).toBe(0);
  });
});
