import type { Meta, StoryObj } from '@storybook/react';
import { Indicator } from './Indicator';
import type { Signal } from '../../types';

const meta: Meta<typeof Indicator> = {
  title: 'Displays/Indicator',
  component: Indicator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof Indicator>;

const SIGNALS: Signal[] = ['ambient', 'decay', 'active', 'hazard', 'ok'];

export const Default: S = { args: { signal: 'active', on: true, label: 'ACTIVE' } };

export const Signals: S = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      {SIGNALS.map((s) => (
        <Indicator key={s} signal={s} on label={s.toUpperCase()} />
      ))}
    </div>
  ),
};

export const Off: S = { args: { signal: 'active', on: false, label: 'DORMANT' } };

export const Sizes: S = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <Indicator size="sm" signal="ok" on label="SM" />
      <Indicator size="md" signal="ok" on label="MD" />
      <Indicator size="lg" signal="ok" on label="LG" />
    </div>
  ),
};

export const WithLabel: S = { args: { signal: 'ambient', on: true, label: 'CORE POWER' } };

// Motion is gated by useReducedMotion() and a @media (prefers-reduced-motion:
// reduce) block in Indicator.module.css. Set the OS "reduce motion" preference
// to verify the lamp warms up instantly.
export const ReducedMotion: S = { args: { signal: 'active', on: true, label: 'NO MOTION' } };
