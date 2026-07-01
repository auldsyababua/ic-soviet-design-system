import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { Knob } from './Knob';

const meta: Meta<typeof Knob> = {
  title: 'Controls/Knob',
  component: Knob,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { value: 50, min: 0, max: 100, onChange: fn() },
};
export default meta;
type S = StoryObj<typeof Knob>;

// Controlled wrapper so stories reflect turns live while still exposing the
// onChange spy from args (the play function can assert on it).
function Controlled({ value, onChange, ...rest }: React.ComponentProps<typeof Knob>) {
  const [v, setV] = useState(value);
  return (
    <Knob
      {...rest}
      value={v}
      onChange={(next) => {
        setV(next);
        onChange(next);
      }}
    />
  );
}

export const Default: S = { render: (args) => <Controlled {...args} /> };

export const Detented: S = {
  render: (args) => <Controlled {...args} detents={6} label="MODE" />,
};

export const Sizes: S = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Controlled {...args} size="sm" />
      <Controlled {...args} size="md" />
      <Controlled {...args} size="lg" />
    </div>
  ),
};

export const WithLabel: S = {
  render: (args) => <Controlled {...args} label="GAIN" />,
};

export const Disabled: S = {
  render: (args) => <Controlled {...args} disabled label="LOCKED" />,
};

// Motion is gated by useReducedMotion + a @media (prefers-reduced-motion) block.
// Set the OS "reduce motion" preference to verify the rotate is instant.
export const ReducedMotion: S = { render: (args) => <Controlled {...args} /> };

export const Keyboard: S = {
  args: { value: 50, step: 5, onChange: fn() },
  render: (args) => <Knob {...args} label="STEP" />,
  play: async ({ canvasElement, args }) => {
    const slider = within(canvasElement).getByRole('slider');
    slider.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(args.onChange).toHaveBeenCalledWith(55);
  },
};
