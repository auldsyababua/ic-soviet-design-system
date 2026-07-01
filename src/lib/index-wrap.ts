// Pure index-stepping math for indexed selectors (RotaryDial, Task 5.1).
// Advances a position within a fixed set, either clamping at the ends or
// wrapping around. No DOM, no React — trivially unit-tested.

/**
 * Advance `current` by `delta` within `[0, count)`.
 *
 * - `wrap === false`: clamp at the ends (`0` and `count - 1`).
 * - `wrap === true`: wrap around modulo `count`, so stepping off one end
 *   re-enters at the other. Works for deltas of any magnitude/sign.
 *
 * Returns `current`'s slot for a degenerate `count <= 0` guard is not needed
 * by callers (a dial always has ≥1 position); a single-position dial (`count
 * === 1`) always yields `0`.
 */
export function stepIndex(current: number, delta: number, count: number, wrap: boolean): number {
  const next = current + delta;
  if (wrap) {
    // JS `%` keeps the sign of the dividend; normalise into [0, count).
    return ((next % count) + count) % count;
  }
  return Math.min(count - 1, Math.max(0, next));
}
