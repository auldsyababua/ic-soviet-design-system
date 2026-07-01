import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { Switch } from './Switch';
import type { SwitchProps } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Controls/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { checked: false, onChange: fn() },
};
export default meta;
type S = StoryObj<typeof Switch>;

// Stateful harness so the lever actually throws in the stories.
function Live({ checked: initial = false, ...props }: Partial<SwitchProps>) {
  const [checked, setChecked] = useState(initial);
  return <Switch {...(props as SwitchProps)} checked={checked} onChange={setChecked} />;
}

function LiveThree({ position: initial = 0 }: { position?: -1 | 0 | 1 }) {
  const [position, setPosition] = useState<-1 | 0 | 1>(initial);
  return (
    <Switch
      kind="three-position"
      position={position}
      checked={position === 1}
      label="MODE"
      onChange={() => setPosition((p) => (p === 1 ? 1 : ((p + 1) as -1 | 0 | 1)))}
    />
  );
}

export const Default: S = { args: { label: 'MAIN' } };

export const Guarded: S = {
  render: () => <Live kind="guarded" label="SCRAM" />,
};

export const ThreePosition: S = {
  render: () => <LiveThree position={0} />,
};

export const Sizes: S = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
      <Live size="sm" label="SM" />
      <Live size="md" label="MD" />
      <Live size="lg" label="LG" />
    </div>
  ),
};

export const Disabled: S = { args: { label: 'LOCKED', disabled: true } };

// Motion is gated by `useReducedMotion` semantics + the `@media
// (prefers-reduced-motion: reduce)` block in Switch.module.css (instant throw).
// Set the OS "reduce motion" preference to verify the lever snaps.
export const ReducedMotion: S = { args: { label: 'NO MOTION' } };

export const Throw: S = {
  render: () => <Live label="TEST" />,
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    await expect(sw).toHaveAttribute('aria-checked', 'true');
  },
};
