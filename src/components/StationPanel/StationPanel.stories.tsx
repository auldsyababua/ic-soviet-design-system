import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StationPanel } from './StationPanel';
import { Switch } from '../Switch';
import { Gauge } from '../Gauge';
import { Indicator } from '../Indicator';

const meta: Meta<typeof StationPanel> = {
  title: 'Assemblies/StationPanel',
  component: StationPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type S = StoryObj<typeof StationPanel>;

// Stateful switch harness so the levers actually throw inside the station.
function LiveSwitch({ label, initial = false }: { label: string; initial?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return <Switch label={label} checked={checked} onChange={setChecked} />;
}

const StatusCluster = () => (
  <>
    <Indicator signal="ok" on label="PWR" size="sm" />
    <Indicator signal="active" on label="LINK" size="sm" />
    <Indicator signal="decay" label="FAULT" size="sm" />
  </>
);

export const Default: S = {
  render: () => (
    <StationPanel title="COOLANT LOOP A" status={<StatusCluster />} hazard>
      <LiveSwitch label="PUMP 1" initial />
      <LiveSwitch label="PUMP 2" />
      <Gauge value={62} unit="PSI" hazardFrom={85} label="PRESS" />
    </StationPanel>
  ),
};

export const NoHazard: S = {
  render: () => (
    <StationPanel title="AUX BUS" status={<StatusCluster />}>
      <LiveSwitch label="MAIN" initial />
      <Gauge value={41} unit="A" activeFrom={30} label="LOAD" />
    </StationPanel>
  ),
};

export const Dense: S = {
  render: () => (
    <StationPanel
      title="REACTOR CONTROL"
      status={
        <>
          <Indicator signal="ok" on label="RDY" size="sm" />
          <Indicator signal="active" on label="SEQ" size="sm" />
          <Indicator signal="hazard" on label="SCRAM" size="sm" />
          <Indicator signal="ambient" on label="STBY" size="sm" />
        </>
      }
      hazard
    >
      <LiveSwitch label="ROD A" initial />
      <LiveSwitch label="ROD B" initial />
      <LiveSwitch label="ROD C" />
      <LiveSwitch label="ROD D" />
      <Gauge value={78} unit="MW" hazardFrom={90} activeFrom={40} label="OUTPUT" size="sm" />
      <Gauge value={310} min={0} max={500} unit="°C" hazardFrom={420} label="CORE" size="sm" />
    </StationPanel>
  ),
};
