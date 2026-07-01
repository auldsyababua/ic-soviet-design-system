import { describe, it, expect } from 'vitest';
import { formatSegments } from './segment';

describe('formatSegments', () => {
  // Canonical spec (Task 2.7)
  it('right-pads/truncates numbers to the digit count', () => {
    expect(formatSegments(42, 4)).toBe('  42');
    expect(formatSegments(13800, 4)).toBe('3800'); // overflow keeps low digits
  });
  it('renders strings (e.g. time) verbatim within width', () => {
    expect(formatSegments('03:42', 5)).toBe('03:42');
  });

  describe('numbers — right-aligned, space-padded', () => {
    it.each([
      [0, 3, '  0'],
      [7, 3, '  7'],
      [42, 4, '  42'],
      [5, 1, '5'], // exact fit
      [100, 3, '100'], // exact fit
    ])('formatSegments(%p, %p) → %p', (value, digits, expected) => {
      expect(formatSegments(value, digits)).toBe(expected);
      expect(formatSegments(value, digits)).toHaveLength(digits);
    });

    it('keeps the low-order digits on overflow (physical counter roll-over)', () => {
      expect(formatSegments(13800, 4)).toBe('3800');
      expect(formatSegments(12345, 3)).toBe('345');
      expect(formatSegments(999999, 2)).toBe('99');
    });

    it('treats the minus sign and decimal point as cells', () => {
      expect(formatSegments(-5, 4)).toBe('  -5'); // String(-5) === '-5'
      expect(formatSegments(1.5, 5)).toBe('  1.5'); // String(1.5) === '1.5'
      expect(formatSegments(-12, 2)).toBe('-12'.slice(-2)); // overflow → '12'
    });
  });

  describe('strings — verbatim, low-order on overflow', () => {
    it.each([
      ['', 3, '   '], // empty → all blanks
      ['A', 3, '  A'], // short → leading blanks
      ['42', 2, '42'], // exact
      ['ABCDEF', 3, 'DEF'], // overflow keeps trailing
      ['03:42:17', 5, '42:17'], // overflow keeps trailing
    ])('formatSegments(%p, %p) → %p', (value, digits, expected) => {
      expect(formatSegments(value, digits)).toBe(expected);
      expect(formatSegments(value, digits)).toHaveLength(digits);
    });
  });

  describe('boundaries', () => {
    it('collapses to empty when digits is 0', () => {
      expect(formatSegments(9, 0)).toBe('');
      expect(formatSegments('', 0)).toBe('');
    });
    it('is idempotent for an already-fitting value', () => {
      const once = formatSegments(42, 6);
      expect(formatSegments(once, 6)).toBe(once);
    });
  });
});
