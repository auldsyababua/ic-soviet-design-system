import type { StationId } from '../data/stations';
import { SegmentDisplay, Indicator } from '@facility/ds';

// Dormant / pre-activation screen content per station (spec appendix):
// no releases or tour dates exist — screens render styled empty states,
// ready to light up when real content arrives via the manifest.

function Line({ children, amber = false }: { children: React.ReactNode; amber?: boolean }) {
  return <div className={amber ? 'amber' : undefined}>{children}</div>;
}

export function StationScreen({ id }: { id: StationId }) {
  switch (id) {
    case 'media':
      return (
        <>
          <div className="title">MEDIA / PLAYBACK</div>
          <hr className="rule" />
          <Line>&gt; AUDIO CHANNEL ......... [indistinct chattering]</Line>
          <Line>&gt; SOURCE ................ AWAITING TRANSMISSION</Line>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '0.4em' }}>
            <SegmentDisplay value="--:--" digits={5} signal="ambient" />
            <Indicator signal="ambient" on={false} label="TAPE" size="sm" />
          </div>
          <Line amber>STANDBY</Line>
        </>
      );
    case 'discography':
      return (
        <>
          <div className="title">DISCOGRAPHY</div>
          <hr className="rule" />
          <Line>&gt; CATALOGUE QUERY ....... 0 RECORDS</Line>
          <Line amber>NO RELEASES LOGGED</Line>
          <Line>
            <span className="dim">&gt; canisters await archival intake</span>
          </Line>
          <div style={{ marginTop: '0.4em' }}>
            <SegmentDisplay value="0000" digits={4} signal="ambient" />
          </div>
        </>
      );
    case 'tour':
      return (
        <>
          <div className="title">TOUR / DISPATCH</div>
          <hr className="rule" />
          <Line amber>NO SCHEDULED DISPATCHES</Line>
          <div style={{ display: 'flex', gap: '1em', marginTop: '0.4em' }}>
            <SegmentDisplay value="--.--" digits={5} signal="ambient" />
            <SegmentDisplay value="--:--" digits={5} signal="ambient" />
          </div>
          <Line>
            <span className="dim">&gt; semaphores locked at neutral</span>
          </Line>
        </>
      );
    case 'gallery':
      return (
        <>
          <div className="title">GALLERY</div>
          <hr className="rule" />
          <Line amber>NO SIGNAL</Line>
          <Line>
            <span className="dim">&gt; all observation feeds dark</span>
          </Line>
          <div style={{ display: 'flex', gap: '0.8em', marginTop: '0.4em' }}>
            <Indicator signal="decay" on={false} label="CAM 1" size="sm" />
            <Indicator signal="decay" on={false} label="CAM 2" size="sm" />
            <Indicator signal="decay" on={false} label="CAM 3" size="sm" />
          </div>
        </>
      );
    case 'about':
      return (
        <>
          <div className="title">ABOUT / PERSONNEL</div>
          <hr className="rule" />
          <Line>&gt; UNIT ................. indistinct Chattering</Line>
          <Line>&gt; FILE ................. SEALED PENDING REVIEW</Line>
          <Line amber>AWAITING BIOGRAPHICAL COPY</Line>
        </>
      );
    case 'press':
      return (
        <>
          <div className="title">PRESS / ARCHIVE</div>
          <hr className="rule" />
          <Line>&gt; CLIPPINGS ............ [REDACTED]</Line>
          <Line amber>AWAITING DECLASSIFICATION</Line>
        </>
      );
    case 'store':
      return (
        <>
          <div className="title">REQUISITIONS</div>
          <hr className="rule" />
          <Line amber>SUPPLY LINE OFFLINE</Line>
          <Line>
            <span className="dim">&gt; no items cleared for issue</span>
          </Line>
        </>
      );
    case 'terminal':
      return (
        <>
          <div className="title">FACILITY TERMINAL</div>
          <hr className="rule" />
          <Line>&gt; CONTAINMENT .......... RINGS NOMINAL</Line>
          <Line>&gt; SINGULARITY .......... OBSERVED · STABLE</Line>
          <Line>&gt; AUDIO ANOMALY ........ [indistinct chattering]</Line>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '0.4em' }}>
            <Indicator signal="active" on label="ARC" size="sm" />
            <SegmentDisplay value="03:42:17" digits={8} signal="active" />
          </div>
        </>
      );
  }
}
