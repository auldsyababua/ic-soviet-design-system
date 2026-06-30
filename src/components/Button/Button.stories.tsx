import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Controls/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof Button>;

export const Default: S = { args: { children: 'INITIATE' } };
export const Secondary: S = { args: { variant: 'secondary', children: 'STANDBY' } };
export const Danger: S = { args: { variant: 'danger', children: 'SCRAM' } };
export const Armed: S = { args: { signal: 'active', children: 'ARMED' } };
export const Sizes: S = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
    </div>
  ),
};
export const Disabled: S = { args: { children: 'LOCKED', disabled: true } };
// Motion is gated by a `@media (prefers-reduced-motion: reduce)` block in
// Button.module.css (and useReducedMotion in interactive components). Set the OS
// "reduce motion" preference to verify the press transition is disabled.
export const ReducedMotion: S = { args: { children: 'NO MOTION' } };
export const Click: S = {
  args: { children: 'TEST', onClick: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
