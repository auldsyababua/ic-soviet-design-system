import type { Meta, StoryObj } from '@storybook/react';
import { Panel } from './Panel';

const meta: Meta<typeof Panel> = {
  title: 'Controls/Panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof Panel>;

const Body = () => (
  <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: 'var(--bone-300)' }}>
    SECTOR 7-G · containment substrate
  </div>
);

export const Default: S = { args: { children: <Body />, style: { width: 360 } } };
export const Steel: S = { args: { finish: 'steel', children: <Body />, style: { width: 360 } } };
export const Concrete: S = { args: { finish: 'concrete', children: <Body />, style: { width: 360 } } };
export const Recessed: S = {
  args: { elevation: 'recessed', children: <Body />, style: { width: 360 } },
};
export const WithRivets: S = {
  args: { rivets: true, children: <Body />, style: { width: 360 } },
};
export const HazardEdge: S = {
  args: { hazardEdge: 'top', children: <Body />, style: { width: 360 } },
};
export const Titled: S = {
  args: { title: 'Reactor Cooling', children: <Body />, style: { width: 360 } },
};
