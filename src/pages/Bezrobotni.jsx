import KpiCard from '../components/KpiCard';
import Card, { SectionHeader, Grid } from '../components/Card';
import HorizontalBar, { blueColor, greenColor } from '../components/HorizontalBar';
import LineChartSVG from '../components/LineChartSVG';
import DonutChart from '../components/DonutChart';
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
/** Top N items by value, sorted desc */
function topN(data, n = 3) {
  return [...data].sort((a, b) => b.value - a.value).slice(0, n);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GenderCell({ icon, label, n, total, color }) {
  return (
    <div style={{
      padding: '10px 14px',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '8px',
      borderLeft: `2px solid ${color}`,
    }}>
      <div style={{
        fontSize: '0.6rem', textTransform: 'uppercase',
        letterSpacing: '0.08em', color, marginBottom: '5px',
      }}>
        {icon} {label}
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        fontSize: '1.05rem', color: 'var(--text)',
      }}>
        {fmt(n)}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '3px' }}>
        {fmtPct(n, total)} ogółu
      </div>
    </div>
  );
}

function ChartLabel({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '22px', height: '2px', background: color, borderRadius: '1px' }} />
      <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{
      fontSize: '0.6rem', textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '5px',
    }}>
      {label}
    </div>
  );
}

function MiniSection({ label, data, colorFn = blueColor }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <SectionLabel label={label} />
      <HorizontalBar data={topN(data, 3)} unit=" os." colorFn={colorFn} barHeight={7} />
    </div>
  );
}

// Wyrej reasons — colored HorizontalBar:
// index 0 (podjęcie pracy) → green; rest → blue variants
function wyrejColor(v, mx, i) {
  if (i === 0) return 'var(--green)';
  const t = mx > 0 ? v / mx : 0;
  const alpha = 0.45 + t * 0.55;
  return `rgba(72,149,239,${alpha.toFixed(2)})`;
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

  // Charakterystyka mini-chart data
  const czasData = czas.map((n, i) => ({ label: CZAS_LABELS[i], value: n }));
  const wiekData = wiek.map((n, i) => ({ label: WIEK_LABELS[i], value: n }));
  const wykData  = wyk.map((n, i)  => ({ label: WYK_LABELS[i],  value: n }));
  const stazData = staz.map((n, i) => ({ label: STAZ_LABELS[i], value: n }));

  // Kategorie — all (already sorted by n desc from Python), + gender bar data
  const kategorieData = kategorie.map(k => ({ label: k.label, value: k.n, pct: k.pct }));

  // Trend zarej / wyrej — last 13 months
  const trendLabels = trend_13m.map(t => t.label);
  const trendZarej  = trend_13m.map(t => t.zarej);
  const trendWyrej  = trend_13m.map(t => t.wyrej);

  // Wyrej reasons — top 5; index-aware color via wrapper
  const wyrejTop5 = wyrej_reasons.slice(0, 5);
  const wyrejMax  = wyrejTop5[0]?.n || 1;
  const wyrejBarData = wyrejTop5.map(r => ({ label: r.label, value: r.n }));
  const wyrejColorFn = (v) => {
    const i = wyrejTop5.findIndex(r => r.n === v);
    return wyrejColor(v, wyrejMax, i);
  };

  const prevLabel = 'grudzień';

  return (
    <div className="page-enter">
      <SectionHeader
        title="Bezrobotni"
        sub="MRPiPS-01 · rejestrowane bezrobocie · województwo mazowieckie"
      />

      {/* ── KPI row ─────────────────────────────────────────────────────── */}
      <Grid cols={4} style={{ marginBottom: '14px' }}>
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
      <Grid cols={2} style={{ marginBottom: '14px' }}>

        {/* Kategorie — płeć + wszystkie kategorie */}
        <Card title="Kategorie bezrobotnych · Sty 2026">
          {/* Płeć — parallel cells */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <GenderCell icon="♀" label="Kobiety"    n={kobiety}   total={genderTotal} color="#f4a261" />
            <GenderCell icon="♂" label="Mężczyźni"  n={mezczyzni} total={genderTotal} color="#4895ef" />
          </div>

          {/* Wszystkie kategorie — wrapLabel=true, barHeight=9 */}
          <HorizontalBar
            data={kategorieData}
            unit=" os."
            colorFn={blueColor}
            barHeight={9}
            wrapLabel={true}
            labelWidth={145}
          />
        </Card>

        {/* Charakterystyka — czas / wiek / wyk / staż, top 3 każda */}
        <Card title="Charakterystyka bezrobotnych">
          <MiniSection label="Czas pozostawania bez pracy" data={czasData} colorFn={blueColor} />
          <MiniSection label="Wiek"                        data={wiekData} colorFn={greenColor} />
          <MiniSection label="Wykształcenie"               data={wykData}  colorFn={blueColor} />
          {stazData.length > 0 && (
            <MiniSection label="Staż pracy ogółem"         data={stazData} colorFn={greenColor} />
          )}
        </Card>
      </Grid>

      {/* ── Napływ/odpływ  +  Przyczyny wyrejestrowania  (jeden wiersz) ── */}
      <Grid cols={2} style={{ marginBottom: '14px' }}>

        {/* Napływ i odpływ */}
        {trend_13m.length > 1 && (
          <Card title="Napływ i odpływ — ostatnie 13 miesięcy">
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <ChartLabel color="#52b788" label={`Zarejestrowani (bież. ${fmt(zarej_razem)})`} />
              <ChartLabel color="#f4a261" label={`Wyrejestrowani (bież. ${fmt(wyrej_razem)})`} />
            </div>
            <LineChartSVG
              datasets={[
                { data: trendZarej, color: '#52b788', label: 'Zarejestrowani' },
                { data: trendWyrej, color: '#f4a261', label: 'Wyrejestrowani' },
              ]}
              labels={trendLabels}
              height={160}
            />
          </Card>
        )}

        {/* Przyczyny wyrejestrowania */}
        {wyrejTop5.length > 0 && (
          <Card title="Przyczyny wyrejestrowania · Sty 2026">
            <DonutChart
              data={wyrejTop5.map(r => ({ label: r.label, value: r.n, pct: r.pct }))}
            />
          </Card>
        )}
      </Grid>
    </div>
  );
}
