// @facility/ds — public API barrel.
// Everything a consumer (the FACILITY app, the design-sync bundle) may import.
// Internal math (src/lib/*) stays private — it is an implementation detail.

// ── Controls ───────────────────────────────────────────────
export * from './components/Button';
export * from './components/Switch';
export * from './components/Knob';
export * from './components/RotaryDial';
export * from './components/Panel';

// ── Displays ───────────────────────────────────────────────
export * from './components/Gauge';
export * from './components/SegmentDisplay';
export * from './components/Indicator';
export * from './components/CRTScreen';
export * from './components/MimicPanel';

// ── Signage ────────────────────────────────────────────────
export * from './components/SignagePlate';
export * from './components/HazardStrip';
export * from './icons';

// ── Panels (composed) ──────────────────────────────────────
export * from './components/StationPanel';

// ── Hooks · tokens · types ─────────────────────────────────
export { useReducedMotion } from './hooks/useReducedMotion';
export { ease, dur, signalVar } from './tokens/tokens';
export type { Signal, Size } from './types';
