import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { ease, dur, signalVar } from './tokens/tokens';
import type { Signal } from './types';

/* ------------------------------------------------------------------ *
 * Foundations/Overview — mirrors design-preview/tokens.html, but every
 * value here resolves to the REAL shipped tokens (tokens.css), fonts
 * (fonts.css) and material utilities (materials.css). It doubles as the
 * "does the look survive inside the package" check.
 * ------------------------------------------------------------------ */

const mono = "'IBM Plex Mono', monospace";
const saira = "'Saira Condensed', sans-serif";

function SectionHead({ no, title, note }: { no: string; title: string; note?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        borderBottom: '1px solid var(--enamel-800)',
        paddingBottom: 8,
        marginBottom: 18,
      }}
    >
      <span style={{ fontFamily: "'DSEG7 Classic', monospace", color: 'var(--signal-active)', fontSize: 18 }}>{no}</span>
      <span
        style={{
          fontFamily: saira,
          fontWeight: 700,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          fontSize: 19,
          color: 'var(--bone-100)',
        }}
      >
        {title}
      </span>
      {note && <span style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 11, color: 'var(--enamel-400)' }}>{note}</span>}
    </div>
  );
}

function Swatch({ token, label, dark }: { token: string; label: string; dark?: boolean }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 74,
        height: 74,
        background: `var(${token})`,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 6,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 9.5,
          lineHeight: 1.25,
          color: dark ? '#fffb' : '#0009',
          background: dark ? '#0007' : '#fff7',
          padding: '1px 3px',
          borderRadius: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

const ENAMEL = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;
const NEUTRALS: [string, string, boolean][] = [
  ['--concrete-200', 'concrete #c2c2bd', false],
  ['--concrete-600', 'concrete #63635d', true],
  ['--steel-200', 'steel #9aa1a3', false],
  ['--steel-600', 'steel #44494b', true],
  ['--rust', 'rust #6e5c4f', true],
  ['--bone-100', 'bone #e8e2d2', false],
  ['--bone-300', 'bone #d4c9b0', false],
  ['--shadow', 'shadow #0c0d0c', true],
  ['--void', 'void #030403', true],
];
const SIGNALS: { role: Signal; name: string; note: string }[] = [
  { role: 'ambient', name: 'Ambient', note: 'sodium amber · powered/occupied' },
  { role: 'decay', name: 'Decay', note: 'dead-fluorescent green' },
  { role: 'active', name: 'Active', note: 'ARC-BLUE · experiment only' },
  { role: 'hazard', name: 'Hazard', note: 'emergency red · danger only' },
  { role: 'ok', name: 'Nominal', note: 'go / ok' },
];

function Lamp({ role }: { role: Signal }) {
  const c = signalVar(role);
  return (
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        flex: 'none',
        position: 'relative',
        background: `radial-gradient(circle at 38% 34%, #fff8, transparent 45%), ${c}`,
        boxShadow: `0 0 14px -2px ${c}`,
      }}
    />
  );
}

const rampLabel: CSSProperties = {
  fontFamily: saira,
  fontWeight: 600,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  fontSize: 12,
  color: 'var(--enamel-300)',
  margin: '0 0 6px',
};

const card: CSSProperties = {
  border: '2px solid var(--enamel-800)',
  borderRadius: 'var(--r-panel)',
  background: '#0f120e',
  padding: '18px 20px',
  boxShadow: 'var(--inset-deep)',
};
const role: CSSProperties = {
  fontFamily: mono,
  fontSize: 10.5,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--signal-active)',
  marginBottom: 10,
};
const meta: CSSProperties = { fontFamily: mono, fontSize: 10.5, color: 'var(--enamel-400)', marginTop: 10 };

function Foundations() {
  return (
    <div style={{ maxWidth: 1100, fontFamily: "'IBM Plex Sans', sans-serif", color: 'var(--enamel-100)' }}>
      {/* 1 — COLOR */}
      <section>
        <SectionHead no="01" title="Color = Signal" note="tokens.css · --enamel-* / --signal-*" />
        <div style={rampLabel}>Enamel grey-green · anchor #5b665c</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 14 }}>
          {ENAMEL.map((s) => (
            <Swatch key={s} token={`--enamel-${s}`} label={s} dark={Number(s) >= 400} />
          ))}
        </div>
        <div style={rampLabel}>Concrete · steel · rust · bone · shadow · void</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 14 }}>
          {NEUTRALS.map(([t, l, d]) => (
            <Swatch key={t} token={t} label={l} dark={d} />
          ))}
        </div>
        <div style={rampLabel}>Signal / light — semantic, used sparingly</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
          {SIGNALS.map((s) => (
            <div
              key={s.role}
              style={{
                padding: 16,
                border: '2px solid var(--enamel-800)',
                borderRadius: 'var(--r-panel)',
                background: '#11140f',
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                boxShadow: 'var(--inset-deep)',
              }}
            >
              <Lamp role={s.role} />
              <div>
                <b
                  style={{
                    fontFamily: saira,
                    fontWeight: 700,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    fontSize: 13,
                    display: 'block',
                    color: 'var(--bone-100)',
                  }}
                >
                  {s.name}
                </b>
                <small style={{ fontFamily: mono, color: 'var(--enamel-400)', fontSize: 10.5 }}>
                  {s.note}
                  <br />
                  --signal-{s.role}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2 — TYPE */}
      <section style={{ marginTop: 40 }}>
        <SectionHead no="02" title="Typography" note="3 roles · self-hosted · OFL" />
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={card}>
            <div style={role}>Display / Signage — Saira Condensed</div>
            <div
              style={{
                fontFamily: saira,
                fontWeight: 800,
                letterSpacing: '.03em',
                textTransform: 'uppercase',
                fontSize: 38,
                color: 'var(--bone-100)',
                lineHeight: 1.02,
              }}
            >
              DANGER · REACTOR HALL · CONTAINMENT 04
            </div>
            <div style={meta}>enamel labels, station names, warnings · all-caps, tight, authoritative</div>
          </div>
          <div style={card}>
            <div style={role}>Hazard signage — Stardos Stencil</div>
            <div style={{ fontFamily: "'Stardos Stencil', sans-serif", fontWeight: 700, fontSize: 30, color: 'var(--signal-hazard)', letterSpacing: '.04em' }}>
              ВЫСОКОЕ НАПРЯЖЕНИЕ · HIGH VOLTAGE
            </div>
            <div style={meta}>stenciled hazard plates only</div>
          </div>
          <div style={card}>
            <div style={role}>Data / Readouts — DSEG (7-seg) + IBM Plex Mono</div>
            <div style={{ fontFamily: "'DSEG7 Classic', monospace", fontSize: 40, color: 'var(--signal-ambient)', letterSpacing: '.06em', textShadow: '0 0 8px #e8951f55' }}>
              88.8&nbsp;&nbsp;1138
            </div>
            <div style={{ fontFamily: "'DSEG7 Classic', monospace", fontSize: 28, marginTop: 6, color: 'var(--signal-active)', letterSpacing: '.06em', textShadow: '0 0 8px #3da9ff55' }}>
              03:42:17
            </div>
            <div style={{ fontFamily: mono, fontSize: 14, color: 'var(--signal-decay)', lineHeight: 1.5, whiteSpace: 'pre-wrap', marginTop: 12 }}>
              {'> FACILITY DIAGNOSTIC v4.2\n> core temp ... 412K  [NOMINAL]\n> containment .. ARC-BLUE LOCKED'}
            </div>
            <div style={meta}>gauges, counters, nixie · terminal / dot-matrix</div>
          </div>
          <div style={card}>
            <div style={role}>Body / Liner notes — IBM Plex Sans</div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: 'var(--enamel-100)', maxWidth: '62ch' }}>
              The crisp UI layer. Track lists, tour dates, credits and liner notes render in a clean neutral grotesk for full
              readability — the legible surface that sits over the dirty, dangerous world.
            </div>
            <div style={meta}>the readable layer · 400 / 500 / 600 / 700</div>
          </div>
        </div>
      </section>

      {/* 3 — MATERIALS (uses the real materials.css utilities) */}
      <section style={{ marginTop: 40 }}>
        <SectionHead no="03" title="Materials & Surfaces" note="materials.css · token recipes" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          <MatSwatch className="mat-crinkle rivets bezel" tag="--mat-crinkle · enamel + rivets" />
          <MatSwatch className="mat-steel bezel" tag="--mat-steel · brushed steel" />
          <MatSwatch className="mat-enamel bezel" tag="recessed well · .inset" inset />
          <MatSwatch className="hazard-stripe bezel" tag="--hazard-stripe · danger edge" />
        </div>
      </section>

      {/* 4 — MOTION (real ease/dur values from tokens.ts) */}
      <section style={{ marginTop: 40 }}>
        <SectionHead no="04" title="Motion — mass & bearing friction" note="nothing snaps · nothing floats" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
          <MotionCard name="Detent" curve={ease.detent} ms={dur.rotate} note="overshoot → settle" />
          <MotionCard name="Thunk" curve={ease.thunk} ms={dur.thunk} note="heavy switch throw" />
          <MotionCard name="Needle" curve={ease.needle} ms={dur.needle} note="damped settle" />
          <MotionCard name="Warm" curve={ease.warm} ms={dur.warm} note="LED warm-up / cool-down" />
        </div>
      </section>
    </div>
  );
}

function MatSwatch({ className, tag, inset }: { className: string; tag: string; inset?: boolean }) {
  return (
    <div className={className} style={{ height: 150, position: 'relative', overflow: 'hidden' }}>
      {inset && <span style={{ position: 'absolute', inset: 22, borderRadius: 2, background: '#1a1d18', boxShadow: 'var(--inset-deep), var(--occlude)' }} />}
      <span
        style={{
          position: 'absolute',
          left: 8,
          bottom: 8,
          fontFamily: mono,
          fontSize: 10,
          color: '#fffc',
          background: '#000a',
          padding: '2px 6px',
          borderRadius: 1,
          zIndex: 2,
        }}
      >
        {tag}
      </span>
    </div>
  );
}

function MotionCard({ name, curve, ms, note }: { name: string; curve: string; ms: number; note: string }) {
  return (
    <div style={{ ...card, padding: 18 }}>
      <div
        style={{
          fontFamily: saira,
          fontWeight: 700,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          fontSize: 13,
          color: 'var(--enamel-200)',
          marginBottom: 10,
        }}
      >
        {name}
      </div>
      <div style={{ fontFamily: mono, fontSize: 11, color: 'var(--signal-active)' }}>{ms}ms</div>
      <div style={{ fontFamily: mono, fontSize: 9.5, color: 'var(--enamel-400)', marginTop: 8 }}>{curve}</div>
      <div style={{ fontFamily: mono, fontSize: 9.5, color: 'var(--enamel-400)', marginTop: 4 }}>{note}</div>
    </div>
  );
}

const meta_: Meta<typeof Foundations> = {
  title: 'Foundations/Overview',
  component: Foundations,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta_;
type S = StoryObj<typeof Foundations>;
export const Overview: S = {};
