import type { Signal } from '../types';

// Easing curves — mirror of the --ease-* tokens in tokens.css, for use from JS
// (inline style transitions, play functions). Mass & bearing friction: nothing
// snaps, nothing floats.
export const ease = {
  detent: 'cubic-bezier(.34,1.32,.5,1)', // overshoot then settle
  thunk: 'cubic-bezier(.7,0,.3,1)', // heavy switch throw
  needle: 'cubic-bezier(.22,1.2,.36,1)', // damped needle settle
  warm: 'cubic-bezier(.4,0,.5,1)', // LED warm-up / cool-down
} as const;

// Durations in milliseconds — mirror of the --dur-* tokens.
export const dur = { rotate: 850, thunk: 200, needle: 900, warm: 320 } as const;

// Resolve a semantic Signal role to its CSS custom property reference.
export const signalVar = (s: Signal) => `var(--signal-${s})`;
