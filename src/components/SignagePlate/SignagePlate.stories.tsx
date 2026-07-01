import type { Meta, StoryObj } from '@storybook/react';
import { SignagePlate } from './SignagePlate';
import { Trefoil } from '../../icons';

const meta: Meta<typeof SignagePlate> = {
  title: 'Signage/SignagePlate',
  component: SignagePlate,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof SignagePlate>;

export const Cast: S = { args: { tier: 'cast', children: 'REACTOR HALL' } };
export const Stencil: S = { args: { tier: 'stencil', children: 'HIGH VOLTAGE' } };
export const Taped: S = { args: { tier: 'taped', children: 'do not touch — V.' } };
export const WithIcon: S = {
  args: { tier: 'cast', icon: <Trefoil size={24} />, children: 'CONTAINMENT 04' },
};
export const Danger: S = {
  args: { tier: 'stencil', severity: 'danger', icon: <Trefoil size={24} />, children: 'DANGER' },
};
