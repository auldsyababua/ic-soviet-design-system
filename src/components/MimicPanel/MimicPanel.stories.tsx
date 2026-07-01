import type { Meta, StoryObj } from '@storybook/react';
import { MimicPanel } from './MimicPanel';
import type { MimicEdge, MimicNode } from './MimicPanel';

const meta: Meta<typeof MimicPanel> = {
  title: 'Displays/MimicPanel',
  component: MimicPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof MimicPanel>;

// A small reactor-cooling loop authored in the 0–100 mimic coordinate space:
//   CORE → PUMP → HEAT EXCHANGER → TOWER, with a bypass tank hanging off the pump.
const COOLING_NODES: MimicNode[] = [
  { id: 'core', x: 18, y: 22, signal: 'ambient', on: true, label: 'CORE' },
  { id: 'pump', x: 18, y: 74, signal: 'active', on: true, label: 'PUMP' },
  { id: 'tank', x: 55, y: 74, signal: 'decay', on: true, label: 'SURGE' },
  { id: 'hx', x: 82, y: 74, signal: 'active', on: true, label: 'HX' },
  { id: 'tower', x: 82, y: 22, signal: 'ok', on: true, label: 'TOWER' },
];

const COOLING_EDGES: MimicEdge[] = [
  { from: 'core', to: 'pump' },
  { from: 'pump', to: 'tank' },
  { from: 'tank', to: 'hx' },
  { from: 'hx', to: 'tower' },
];

export const Default: S = {
  args: { nodes: COOLING_NODES, edges: COOLING_EDGES },
};

export const AllActive: S = {
  args: {
    edges: COOLING_EDGES,
    nodes: COOLING_NODES.map((n) => ({ ...n, signal: 'active', on: true })),
  },
};

export const WithHazard: S = {
  args: {
    edges: COOLING_EDGES,
    nodes: COOLING_NODES.map((n) => (n.id === 'hx' ? { ...n, signal: 'hazard', on: true } : n)),
  },
};
