import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { RotaryDial } from './RotaryDial';
import type { RotaryDialProps } from './RotaryDial';

const meta: Meta<typeof RotaryDial> = {
  title: 'Controls/RotaryDial',
  component: RotaryDial,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof RotaryDial>;

const STATIONS = [
  { id: 'reactor', label: 'REACTOR' },
  { id: 'coolant', label: 'COOLANT' },
  { id: 'turbine', label: 'TURBINE' },
  { id: 'grid', label: 'GRID' },
  { id: 'aux', label: 'AUX' },
  { id: 'comms', label: 'COMMS' },
  { id: 'vault', label: 'VAULT' },
  { id: 'purge', label: 'PURGE' },
];

const MODES = [
  { id: 'off', label: 'OFF' },
  { id: 'std', label: 'STD' },
  { id: 'max', label: 'MAX' },
];

// Stateful harness so the pointer actually turns in the stories.
function Live({
  index: initial = 0,
  ...props
}: Partial<RotaryDialProps> & { positions: RotaryDialProps['positions'] }) {
  const [index, setIndex] = useState(initial);
  return <RotaryDial {...props} positions={props.positions} index={index} onChange={setIndex} />;
}

export const Dial: S = {
  render: () => <Live positions={STATIONS} index={0} variant="dial" />,
};

export const Compact: S = {
  render: () => <Live positions={MODES} index={1} variant="compact" />,
};

export const Wrap: S = {
  render: () => <Live positions={STATIONS} index={7} variant="dial" wrap />,
};

// Motion is gated by the `@media (prefers-reduced-motion: reduce)` block in
// RotaryDial.module.css (the pointer snaps instantly). Set the OS "reduce
// motion" preference to verify.
export const ReducedMotion: S = {
  render: () => <Live positions={STATIONS} index={0} variant="dial" />,
};

export const Keyboard: S = {
  args: { positions: STATIONS, index: 0, onChange: fn(), variant: 'dial' },
  play: async ({ canvasElement, args }) => {
    const group = within(canvasElement).getByRole('radiogroup');
    group.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onChange).toHaveBeenCalledWith(1);
  },
};
