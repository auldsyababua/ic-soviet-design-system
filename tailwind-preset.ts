import type { Config } from 'tailwindcss';
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        enamel: { 50: 'var(--enamel-50)', 500: 'var(--enamel-500)', 900: 'var(--enamel-900)' },
        signal: {
          ambient: 'var(--signal-ambient)',
          decay: 'var(--signal-decay)',
          active: 'var(--signal-active)',
          hazard: 'var(--signal-hazard)',
          ok: 'var(--signal-ok)',
        },
        shadow: 'var(--shadow)',
        void: 'var(--void)',
        bone: 'var(--bone-100)',
      },
      borderRadius: { machined: 'var(--r-machined)', panel: 'var(--r-panel)' },
      transitionTimingFunction: {
        detent: 'var(--ease-detent)',
        thunk: 'var(--ease-thunk)',
        needle: 'var(--ease-needle)',
        warm: 'var(--ease-warm)',
      },
    },
  },
};
export default preset;
