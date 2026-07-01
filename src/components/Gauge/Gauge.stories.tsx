import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { Gauge } from './Gauge';

const meta: Meta<typeof Gauge> = {
  title: 'Displays/Gauge',
  component: Gauge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { value: 42, min: 0, max: 100 },
};
export default meta;
type S = StoryObj<typeof Gauge>;

export const Default: S = { args: { value: 42, unit: 'PSI', label: 'PRESSURE' } };

export const WithHazardZone: S = {
  args: { value: 88, hazardFrom: 80, unit: 'KV', label: 'POTENTIAL' },
};

export const WithActiveZone: S = {
  args: { value: 60, activeFrom: 40, hazardFrom: 85, unit: 'MW', label: 'OUTPUT' },
};

export const Sizes: S = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
      <Gauge {...args} size="sm" />
      <Gauge {...args} size="md" />
      <Gauge {...args} size="lg" />
    </div>
  ),
};

export const Sweep: S = {
  args: { value: 75, min: 0, max: 100, unit: 'PSI', label: 'PRESSURE' },
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter');
    await expect(meter).toHaveAttribute('aria-valuenow', '75');
    await expect(meter).toHaveAttribute('aria-valuemin', '0');
    await expect(meter).toHaveAttribute('aria-valuemax', '100');
  },
};

// Motion is gated by useReducedMotion + a @media (prefers-reduced-motion) block.
// Set the OS "reduce motion" preference to verify the needle jumps to value.
export const ReducedMotion: S = { args: { value: 42, unit: 'PSI', label: 'PRESSURE' } };
