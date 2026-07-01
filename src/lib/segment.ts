// Pure formatting util for SegmentDisplay (Task 2.7). Maps an arbitrary value
// onto a fixed-width segment readout: numbers are space-padded and right-aligned
// to `digits`, overflow keeping the low-order (rightmost) digits like a real
// physical counter rolling over; strings render verbatim, clamped to width.

/**
 * Format `value` to exactly `digits` segment cells.
 *
 * - Numbers: stringified, right-aligned with leading spaces. If wider than
 *   `digits`, the high-order digits are dropped (the readout keeps the low
 *   digits — `13800` on a 4-wide display shows `3800`).
 * - Strings: kept as-is when they fit; if wider than `digits`, the trailing
 *   `digits` characters are kept (mirrors the number low-order rule).
 */
export function formatSegments(value: string | number, digits: number): string {
  const raw = typeof value === 'number' ? String(value) : value;
  if (raw.length > digits) return raw.slice(raw.length - digits);
  return raw.padStart(digits, ' ');
}
