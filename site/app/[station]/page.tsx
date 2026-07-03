import { notFound } from 'next/navigation';
import { STATIONS, byId, isStationId } from '../../data/stations';
import { WorldShell } from '../../components/WorldShell';

export function generateStaticParams() {
  return STATIONS.map((s) => ({ station: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ station: string }> }) {
  const { station } = await params;
  if (!isStationId(station)) return {};
  return { title: `${byId(station).label} · INDISTINCT CHATTERING` };
}

// Deep links land already facing this station (no first-paint spin, spec §6);
// the visually-hidden section is the semantic spine for no-JS / screen readers.
export default async function StationPage({ params }: { params: Promise<{ station: string }> }) {
  const { station } = await params;
  if (!isStationId(station)) notFound();
  const s = byId(station);
  return (
    <main>
      <section className="sr-only" aria-label={s.label}>
        <h1>{s.label} — indistinct Chattering</h1>
        <p>
          Station dormant. No content has been transmitted yet — releases, dates, and files will appear here when the
          facility comes online.
        </p>
        <nav aria-label="All stations">
          <ul>
            {STATIONS.map((t) => (
              <li key={t.id}>
                <a href={t.route}>{t.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <WorldShell initialId={s.id} />
    </main>
  );
}
