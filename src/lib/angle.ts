// Pure angle math for rotary controls (Knob, Task 2.8) and analog dials
// (Gauge, Task 2.9). Both map a value within [min,max] onto a rotation in
// degrees, centered on 0 so the resting/midpoint position points "up".

/**
 * Map `value` (in `[min,max]`) onto a rotation in degrees over a symmetric
 * `sweep`: `min → -sweep/2`, `max → +sweep/2`, midpoint → `0`.
 *
 * Used by the Knob, whose default 270° sweep yields the classic ±135° rotary
 * range. The result is not clamped — callers clamp `value` before display.
 */
export function valueToAngle(value: number, min: number, max: number, sweep: number): number {
  const span = max - min;
  if (span === 0) return 0;
  const fraction = (value - min) / span; // 0..1
  return fraction * sweep - sweep / 2;
}

/**
 * Map `value` (in `[min,max]`) onto a needle angle over a fixed 180° sweep:
 * `min → -90`, `max → +90`, midpoint → `0` (needle pointing straight up).
 *
 * Thin specialization of {@link valueToAngle} for the Gauge dial.
 */
export function needleAngle(value: number, min: number, max: number): number {
  return valueToAngle(value, min, max, 180);
}
