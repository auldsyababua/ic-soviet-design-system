import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './MimicPanel.module.css';
import { Panel } from '../Panel';
import { Indicator } from '../Indicator';
import type { Signal, Size } from '../../types';

export interface MimicNode {
  id: string;
  /** X position in the 0–100 mimic coordinate space (left → right). */
  x: number;
  /** Y position in the 0–100 mimic coordinate space (top → bottom). */
  y: number;
  signal?: Signal;
  on?: boolean;
  label?: string;
}

export interface MimicEdge {
  from: string;
  to: string;
}

export interface MimicPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Schematic nodes, positioned in the 0–100 coordinate space. */
  nodes: MimicNode[];
  /** Engraved pipe/wire runs, each referencing two node ids. */
  edges: MimicEdge[];
  size?: Size;
}

// The mimic board is authored in an abstract 0–100 × 0–100 coordinate space
// (top-left origin). Edges are drawn in that space via an SVG viewBox; nodes are
// absolutely positioned as percentages so the live Indicator lamps sit exactly
// over their schematic junctions regardless of the rendered board size.
const VIEW = 100;

export const MimicPanel = forwardRef<HTMLDivElement, MimicPanelProps>(function MimicPanel(
  { nodes, edges, size = 'md', className = '', style, ...rest },
  ref,
) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <Panel
      ref={ref}
      finish="concrete"
      elevation="recessed"
      className={[styles.mimic, styles[size], className].join(' ')}
      style={style}
      {...rest}
    >
      <div className={styles.field}>
        {/* Engraved schematic runs. Decorative relative to the node lamps, which
            carry their own labels — so the diagram gets a single group label. */}
        <svg
          className={styles.schematic}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Schematic mimic diagram"
        >
          {edges.map(({ from, to }, i) => {
            const a = byId.get(from);
            const b = byId.get(to);
            if (!a || !b) return null;
            return (
              <g key={`${from}-${to}-${i}`} className={styles.run}>
                {/* dark engraved channel */}
                <line className={styles.channel} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                {/* light machined highlight riding the channel */}
                <line className={styles.highlight} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              </g>
            );
          })}
        </svg>

        {/* Live nodes — real Indicator lamps positioned over their junctions. */}
        {nodes.map((n) => (
          <span
            key={n.id}
            className={styles.node}
            style={{ ['--nx']: `${n.x}%`, ['--ny']: `${n.y}%` } as CSSProperties}
          >
            <Indicator signal={n.signal ?? 'active'} on={n.on ?? false} label={n.label} size={size} />
          </span>
        ))}
      </div>
    </Panel>
  );
});
