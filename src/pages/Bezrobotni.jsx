import KpiCard from '../components/KpiCard';
import Card, { SectionHeader, Grid } from '../components/Card';
import HorizontalBar, { blueColor } from '../components/HorizontalBar';
import LineChartSVG from '../components/LineChartSVG';
import WyrejList from '../components/WyrejList';
import CharMiniCards from '../components/CharMiniCards';
import { useAppData } from '../context/DataContext';

const CZAS_LABELS = ['do 1 mies.', '1–3 mies.', '3–6 mies.', '6–12 mies.', '12–24 mies.', 'pow. 24 mies.'];
const WIEK_LABELS = ['18–24 lat', '25–34 lat', '35–44 lat', '45–54 lat', '55–59 lat', '60+ lat'];
const WYK_LABELS  = ['Wyższe', 'Pol./śr. zaw.', 'Średnie og.', 'Zasadnicze', 'Podst./brak'];
const STAZ_LABELS = ['do 1 roku', '1–5 lat', '5–10 lat', '10–20 lat', '20–30 lat', '30+ lat', 'Bez stażu'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}
function fmtPct(n, total) {
  return total ? (n / total * 100).toFixed(1).replace('.', ',') + '%' : '—';
}
function fmtDelta(d, label = 'grudzień') {
  if (d == null || isNaN(d)) return '…';
  const abs = Math.abs(d).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return d >= 0 ? `↑ +${abs} vs. ${label}` : `↓ −${abs} vs. ${label}`;
}
function dtType(d) {
  if (d == null) return 'eq';
  return d >= 0 ? 'up' : 'dn';
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function FemaleIcon({ color = 'currentColor', size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="12" cy="4" r="3" />
      {/* Body - dress/skirt shape */}
      <path d="M12 8c-2 0-3 1-3.5 2L6 18h3l1-4v8h4v-8l1 4h3l-2.5-8c-.5-1-1.5-2-3.5-2z" />
    </svg>
  );
}

function MaleIcon({ color = 'currentColor', size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="12" cy="4" r="3" />
      {/* Body - torso */}
      <rect x="9" y="8" width="6" height="7" rx="1" />
      {/* Legs */}
      <rect x="9" y="15" width="2.5" height="7" rx="0.5" />
      <rect x="12.5" y="15" width="2.5" height="7" rx="0.5" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GenderCell({ gender, label, n, total, color }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '8px',
      borderLeft: `3px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{ opacity: 0.9, flexShrink: 0 }}>
        {gender === 'female' ? <FemaleIcon color={color} size={36} /> : <MaleIcon color={color} size={36} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '0.6rem', textTransform: 'uppercase',
          letterSpacing: '0.08em', color, marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          fontSize: '1.1rem', color: 'var(--text)',
        }}>
          {fmt(n)}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '2px' }}>
          {fmtPct(n, total)} ogółu
        </div>
      </div>
    </div>
  );
}


// ── Main page ─────────────────────────────────────────────────────────────────

export default function Bezrobotni() {
  const { bezrobotni, loading } = useAppData();

  if (!bezrobotni) return null;

  const {
    bezr_razem, bezr_delta,
    wyrej_razem, wyrej_delta,
    zarej_razem, zarej_delta,
    oferty_razem, oferty_delta,
    kategorie   = [],
    charakterystyka,
    wyrej_reasons = [],
    trend_13m     = [],
  } = bezrobotni;

  const { kobiety, mezczyzni, czas, wiek, wyk, staz = [] } = charakterystyka;
  const genderTotal = kobiety + mezczyzni;

  const czasData = czas.map((n, i) => ({ label: CZAS_LABELS[i], value: n }));
  const wiekData = wiek.map((n, i) => ({ label: WIEK_LABELS[i], value: n }));
  const wykData  = wyk.map((n, i)  => ({ label: WYK_LABELS[i],  value: n }));
  const stazData = staz.map((n, i) => ({ label: STAZ_LABELS[i], value: n }));

  const kategorieData = kategorie.map(k => ({ label: k.label, value: k.n, pct: k.pct }));

  const trendLabels = trend_13m.map(t => t.label);
  const trendZarej  = trend_13m.map(t => t.zarej);
  const trendWyrej  = trend_13m.map(t => t.wyrej);

  const wyrejTop5 = wyrej_reasons.slice(0, 5);

  const prevLabel = 'grudzień';

  return (
    <div className="page-enter">
      <SectionHeader
        title="Bezrobotni"
        sub="MRPiPS-01 · rejestrowane bezrobocie · województwo mazowieckie"
      />

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <Grid cols={4}>
        <KpiCard
          flag="Stan końcowy" flagColor="maz"
          target={loading ? 0 : bezr_razem} label="Zarejestrowanych"
          delta={loading ? '…' : fmtDelta(bezr_delta, prevLabel)}
          deltaType={loading ? 'eq' : dtType(bezr_delta)}
        />
        <KpiCard
          flag="Wyrejestrowani" flagColor="green"
          target={loading ? 0 : wyrej_razem} label="w miesiącu"
          delta={loading ? '…' : fmtDelta(wyrej_delta, prevLabel)}
          deltaType={loading ? 'eq' : dtType(wyrej_delta)}
          variant="green"
        />
        <KpiCard
          flag="Zarejestrowani" flagColor="pl"
          target={loading ? 0 : zarej_razem} label="w miesiącu"
          delta={loading ? '…' : fmtDelta(zarej_delta, prevLabel)}
          deltaType={loading ? 'eq' : dtType(zarej_delta)}
        />
        <KpiCard
          flag="Oferty pracy" flagColor="green"
          target={loading ? 0 : oferty_razem} label="w województwie"
          delta={loading ? '…' : fmtDelta(oferty_delta, prevLabel)}
          deltaType={loading ? 'eq' : dtType(oferty_delta)}
          variant="green"
        />
      </Grid>

      {/* ── Kategorie + Charakterystyka ─────────────────────────────────── */}
      <Grid cols={2} grow>
        <Card title="Kategorie bezrobotnych · Sty 2026" grow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <GenderCell gender="female" label="Kobiety"    n={kobiety}   total={genderTotal} color="#f4a261" />
            <GenderCell gender="male"   label="Mężczyźni"  n={mezczyzni} total={genderTotal} color="#4895ef" />
          </div>
          <HorizontalBar
            data={kategorieData}
            unit=" os."
            colorFn={blueColor}
            barHeight={9}
            wrapLabel={true}
            labelWidth={145}
          />
        </Card>

        <Card title="Charakterystyka bezrobotnych" grow>
          <CharMiniCards
            czasData={czasData}
            wiekData={wiekData}
            wykData={wykData}
            stazData={stazData}
          />
        </Card>
      </Grid>

      {/* ── Napływ/odpływ + Przyczyny wyrejestrowania ──────────────────── */}
      <Grid cols={2} grow>
        {trend_13m.length > 1 && (
          <Card title="Napływ i odpływ bezrobotnych — ostatnie 13 miesięcy" grow>
            <LineChartSVG
              datasets={[
                { data: trendZarej, color: '#e63946', label: 'Zarejestrowani' },
                { data: trendWyrej, color: '#4895ef', label: 'Wyrejestrowani' },
              ]}
              labels={trendLabels}
              height={160}
            />
          </Card>
        )}
        {wyrejTop5.length > 0 && (
          <Card title="Przyczyny wyrejestrowania · Sty 2026" grow>
            <WyrejList
              data={wyrejTop5.map(r => ({ label: r.label, value: r.n, pct: r.pct }))}
            />
          </Card>
        )}
      </Grid>
    </div>
  );
}
