import type { StationId } from '../data/stations';
import { SegmentDisplay, Indicator } from '@facility/ds';

// DUMMY CONTENT for layout evaluation — every title, date, and figure below is
// placeholder fiction, to be replaced by the real content model / manifest.

function Line({ children, amber = false }: { children: React.ReactNode; amber?: boolean }) {
  return <div className={amber ? 'amber' : undefined}>{children}</div>;
}

function Row({ l, r, dim = false }: { l: React.ReactNode; r: React.ReactNode; dim?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.2em' }} className={dim ? 'dim' : undefined}>
      <span>{l}</span>
      <span>{r}</span>
    </div>
  );
}

export function StationScreen({ id }: { id: StationId }) {
  switch (id) {
    case 'media':
      return (
        <>
          <div className="title">MEDIA / PLAYBACK</div>
          <hr className="rule" />
          <Line amber>NOW TRANSMITTING · "PERIMETER HYMN"</Line>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em', margin: '0.3em 0' }}>
            <SegmentDisplay value="02:34" digits={5} signal="active" />
            <Indicator signal="active" on label="TAPE" size="sm" />
            <Indicator signal="ambient" on label="TX" size="sm" />
          </div>
          <Row l="02 STATIC PSALM" r="04:12" dim />
          <Row l="03 CHORUS OF SERVOS" r="05:47" dim />
          <Row l="04 [indistinct chattering]" r="--:--" dim />
        </>
      );
    case 'discography':
      return (
        <>
          <div className="title">DISCOGRAPHY</div>
          <hr className="rule" />
          <Row l="IC-001 · TRANSMISSION ONE" r="1983 · LP" />
          <Row l="IC-002 · CHORUS OF SERVOS" r="1985 · LP" />
          <Row l="IC-003 · BE ON THE MEND" r="1987 · EP" />
          <hr className="rule" />
          <Line>
            <span className="dim">&gt; 3 RECORDS ON FILE · ARCHIVE NOMINAL</span>
          </Line>
          <div style={{ marginTop: '0.3em' }}>
            <SegmentDisplay value="0003" digits={4} signal="ambient" />
          </div>
        </>
      );
    case 'tour':
      return (
        <>
          <div className="title">TOUR / DISPATCH</div>
          <hr className="rule" />
          <Row l="10.03 · SVOBODNY-9 · DEPOT HALL" r="CONFIRMED" />
          <Row l="17.03 · KURCHATOV · PALACE OF CULTURE" r="CONFIRMED" />
          <Row l="24.03 · OBNINSK-2 · TURBINE SHED" r="WAITLIST" />
          <Row l="31.03 · [REDACTED] · SECTOR GAMMA" r="CLASSIFIED" dim />
          <div style={{ display: 'flex', gap: '1em', marginTop: '0.35em' }}>
            <SegmentDisplay value="10.03" digits={5} signal="ambient" />
            <Indicator signal="ok" on label="DISPATCH" size="sm" />
          </div>
        </>
      );
    case 'gallery':
      return (
        <>
          <div className="title">GALLERY</div>
          <hr className="rule" />
          <div style={{ display: 'flex', gap: '1.2em', margin: '0.2em 0' }}>
            <Indicator signal="decay" on label="CAM 1" size="sm" />
            <Indicator signal="decay" on label="CAM 2" size="sm" />
            <Indicator signal="hazard" on={false} label="CAM 3" size="sm" />
          </div>
          <Row l="CAM 1 · REACTOR HALL" r="LIVE" />
          <Row l="CAM 2 · ARCHIVE VAULT" r="LIVE" />
          <Row l="CAM 3 · PERIMETER" r="NO SIGNAL" dim />
        </>
      );
    case 'about':
      return (
        <>
          <div className="title">ABOUT / PERSONNEL</div>
          <hr className="rule" />
          <Line amber>UNIT DOSSIER · indistinct Chattering</Line>
          <Row l="SUBJECT A" r="VOCALS / TRANSMISSION" dim />
          <Row l="SUBJECT B" r="GUITARS / NOISE" dim />
          <Row l="SUBJECT C" r="SYNTHESIS / SERVOS" dim />
          <Row l="SUBJECT D" r="PERCUSSION / DOORS" dim />
          <Line>
            <span className="dim">&gt; FILE PARTIALLY DECLASSIFIED · REV 4</span>
          </Line>
        </>
      );
    case 'press':
      return (
        <>
          <div className="title">PRESS / ARCHIVE</div>
          <hr className="rule" />
          <Row l={'"CHATTER FROM THE DEEP FACILITY"'} r="WIRE/UK · 12.85" />
          <Row l={'"МУЗЫКА ИЛИ СИГНАЛ?"'} r="[REDACTED] · 03.86" />
          <Row l={'"NOISE HYMNS OF OBJECT 17"'} r="SAMIZDAT · 07.86" />
          <hr className="rule" />
          <Line>
            <span className="dim">&gt; "...not music, exactly — a facility learning to sing."</span>
          </Line>
        </>
      );
    case 'store':
      return (
        <>
          <div className="title">REQUISITIONS</div>
          <hr className="rule" />
          <Row l="LP · TRANSMISSION ONE" r="IN STOCK" />
          <Row l="CASSETTE · CHORUS OF SERVOS" r="LOW STOCK" />
          <Row l="ENAMEL PIN · TREFOIL" r="IN STOCK" />
          <Row l="POSTER · CONTAINMENT 04" r="OUT OF STOCK" dim />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '0.35em' }}>
            <Indicator signal="ok" on label="SUPPLY LINE" size="sm" />
          </div>
        </>
      );
    case 'terminal':
      return (
        <>
          <div className="title">FACILITY TERMINAL</div>
          <hr className="rule" />
          <Line>&gt; 03:42:17 CONTAINMENT RINGS NOMINAL</Line>
          <Line>&gt; 03:42:31 AUDIO ANOMALY .... [indistinct chattering]</Line>
          <Line>&gt; 03:44:02 SPECTRAL PEAK 440 HZ — SOURCE UNKNOWN</Line>
          <Line amber>ARC INTEGRITY 98.7% · OBSERVATION CONTINUES</Line>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '0.3em' }}>
            <Indicator signal="active" on label="ARC" size="sm" />
            <SegmentDisplay value="03:44:02" digits={8} signal="active" />
          </div>
        </>
      );
  }
}
