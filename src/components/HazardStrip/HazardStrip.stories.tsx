import type { Meta, StoryObj } from '@storybook/react';
import { HazardStrip } from './HazardStrip';

const meta: Meta<typeof HazardStrip> = {
  title: 'Signage/HazardStrip',
  component: HazardStrip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof HazardStrip>;

export const Default: S = {
  args: { severity: 'caution' },
  render: (a) => (
    <div style={{ width: 360 }}>
      <HazardStrip {...a} />
    </div>
  ),
};
export const Danger: S = {
  args: { severity: 'danger' },
  render: (a) => (
    <div style={{ width: 360 }}>
      <HazardStrip {...a} />
    </div>
  ),
};
export const Vertical: S = {
  args: { orientation: 'vertical' },
  render: (a) => (
    <div style={{ height: 160 }}>
      <HazardStrip {...a} />
    </div>
  ),
};
export const Thick: S = {
  args: { thickness: 28 },
  render: (a) => (
    <div style={{ width: 360 }}>
      <HazardStrip {...a} />
    </div>
  ),
};
