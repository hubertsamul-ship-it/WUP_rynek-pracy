import { useState, useMemo, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import Card, { SectionHeader, Grid } from '../components/Card';
import HorizontalBar, { blueColor, greenColor } from '../components/HorizontalBar';
import LineChartSVG from '../components/LineChartSVG';
import { useAppData } from '../context/DataContext';

const POW_COLORS = ['#e63946', '#4895ef', '#f4a261', '#52b788', '#a78bfa', '#fbbf24'];

function PowiatSelector({ selected, onChange, allPowiaty, max = 6 }) {
  const [open, setOpen] = useState(false);
  const available = allPowiaty.filter(p => !selected.includes(p.wgm));
  const getName = (wgm) => allPowiaty.find(p => p.wgm === wgm)?.nazwa || wgm;
  const getStopa = (wgm) => allPowiaty.find(p => p.wgm === wgm)?.stopa;

  const remove = (wgm) => {
    if (selected.length > 1) onChange(selected.filter(w => w !== wgm));
  };
  const add = (wgm) => {
    if (selected.length < max) onChange([...selected, wgm]);
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', position: 'relative' }}>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
      )}
      {selected.map((wgm, i) => (
        <div key={wgm} style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '3px 8px 3px 10px', borderRadius: '20px',
          background: `${POW_COLORS[i]}22`, border: `1px solid ${POW_COLORS[i]}66`,
          fontSize: '0.72rem', color: 'var(--text)',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: POW_COLORS[i], flexShrink: 0 }} />
          {getName(wgm)}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
            color: POW_COLORS[i], marginLeft: '2px',
          }}>
            {getStopa(wgm)?.toFixed(1).replace('.', ',')}%
          </span>
          {selected.length > 1 && (
            <button
              onClick={() => remove(wgm)}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '0 0 0 2px', lineHeight: 1, fontSize: '0.82rem', display: 'flex', alignItems: 'center' }}
              title={`Usuń ${getName(wgm)}`}
            >×</button>
          )}
        </div>
      ))}
      {selected.length < max && (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '20px', color: 'var(--muted)', cursor: 'pointer', padding: '3px 12px',
              fontSize: '0.72rem', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s',
            }}
          >+ Dodaj</button>
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0,
              background: '#1a2233', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px', padding: '4px 0',
              maxHeight: '260px', overflowY: 'auto', minWidth: '210px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 101,
            }}>
              {available.map(p => (
                <button
                  key={p.wgm}
                  onClick={() => add(p.wgm)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    color: 'var(--text)', padding: '6px 14px', fontSize: '0.75rem',
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span>{p.nazwa}</span>
                  <span style={{ color: 'var(--muted)', marginLeft: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem' }}>
                    {p.stopa?.toFixed(1).replace('.', ',')}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CZAS_LABELS = ['do 1 mies.', '1–3 mies.', '3–6 mies.', '6–12 mies.', '12–24 mies.', 'pow. 24 mies.'];
const WIEK_LABELS = ['18–24 lat', '25–34 lat', '35–44 lat', '45–54 lat', '55–59 lat', '60+ lat'];
const WYK_LABELS  = ['Wyższe', 'Pol./śr. zaw.', 'Średnie og.', 'Zasadnicze', 'Podst./brak'];
const STAZ_LABELS = ['do 1 roku', '1–5 lat', '5–10 lat', '10–20 lat', '20–30 lat', '30+ lat', 'Bez stażu'];

function fmt(n) {
  if (n == null) return '—';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}
function fmtPct(n, total) {
  return total ? (n / total * 100).toFixed(1).replace('.', ',') + '%' : '—';
}
function topN(data, n = 3) {
  return [...data].sort((a, b) => b.value - a.value).slice(0, n);
}

function GenderCell({ icon, label, n, total, color }) {
  return (
    <div style={{
      padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
      borderRadius: '8px', borderLeft: `2px solid ${color}`,
    }}>
      <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: '5px' }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
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
    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '5px' }}>
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

function wyrejColor(v, mx, i) {
  if (i === 0) return 'var(--green)';
  const t = mx > 0 ? v / mx : 0;
  const alpha = 0.45 + t * 0.55;
  return `rgba(72,149,239,${alpha.toFixed(2)})`;
}

export default function Powiaty({ initialPowiat = null }) {
  const { powiaty, stopa } = useAppData();

  const options = (powiaty || [])
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'))
    .map(p => ({ value: p.wgm, label: p.nazwa }));

  const [selWgm, setSelWgm] = useState(initialPowiat);
  const [cmpWgms, setCmpWgms] = useState([initialPowiat || '1465']); // domyślnie Warszawa

  const defaultWgm = (powiaty || []).find(p => p.wgm === '1465')?.wgm || options[0]?.value || null;
  const wgm = selWgm || defaultWgm;

  // Sync pierwsza pozycja wykresu z głównym selectorem
  useEffect(() => {
    if (wgm) setCmpWgms(prev => [wgm, ...prev.slice(1).filter(w => w !== wgm)]);
  }, [wgm]);
  const d = (powiaty || []).find(p => p.wgm === wgm) || {};

  if (!powiaty || powiaty.length === 0) return null;

  const bezr = d.bezr_razem || 0;
  const wyrej = d.wyrej_razem || 0;

  // Charakterystyka
  const czasData = (d.d5_czas || []).map((n, i) => ({ label: CZAS_LABELS[i], value: n }));
  const wiekData = (d.d5_wiek || []).map((n, i) => ({ label: WIEK_LABELS[i], value: n }));
  const wykData  = (d.d5_wyk  || []).map((n, i) => ({ label: WYK_LABELS[i],  value: n }));
  const stazData = (d.d5_staz || []).map((n, i) => ({ label: STAZ_LABELS[i], value: n }));

  const kobiety   = d.d5_kobiety || 0;
  const mezczyzni = bezr - kobiety;
  const kategorieData = (d.kategorie || []).map(k => ({ label: k.label, value: k.n, pct: k.pct }));

  // Trend — etykiety z globalnego trend Mazowsza (te same 13 miesięcy)
  const trendLabels = (stopa?.trend_maz_13m || []).map(t => t.label);

  // Dane wykresu porównawczego stopy
  const powSorted = useMemo(() =>
    [...(powiaty || [])].sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl')),
    [powiaty]
  );
  const stopaDatasets = useMemo(() =>
    cmpWgms.map((wgm, i) => {
      const p = (powiaty || []).find(x => x.wgm === wgm);
      return { color: POW_COLORS[i % POW_COLORS.length], label: p?.nazwa || wgm, data: p?.trend_stopa_13m || [] };
    }),
    [cmpWgms, powiaty]
  );
  const trendZarej = d.trend_zarej_13m || [];
  const trendWyrej = d.trend_wyrej_13m || [];
  // Przyczyny wyrejestrowania
  const wyrejTop5 = (d.wyrej_reasons || []).slice(0, 5);
  const wyrejMax  = wyrejTop5[0]?.n || 1;
  const wyrejBarData = wyrejTop5.map(r => ({ label: r.label, value: r.n }));
  const wyrejColorFn = (v) => {
    const i = wyrejTop5.findIndex(r => r.n === v);
    return wyrejColor(v, wyrejMax, i);
  };

  return (
    <div className="page-enter">
      <SectionHeader
        title="Analiza powiatowa"
        sub="MRPiPS-01 · ZUS · województwo mazowieckie · Styczeń 2026"
      />

      {/* Selector */}
      <select
        value={wgm || ''}
        onChange={e => setSelWgm(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)', borderRadius: '10px',
          color: 'var(--text)', fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem',
          cursor: 'pointer', appearance: 'none', marginBottom: '16px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#111827' }}>
            {o.label}
          </option>
        ))}
      </select>

      {/* ── KPI row — 6 kart (3 + 3) ─────────────────────────────────────── */}
      <Grid cols={3} style={{ marginBottom: '14px' }}>
        <KpiCard flag="Stan końcowy" flagColor="maz"
          target={bezr} label="Zarejestrowanych" />
        <KpiCard flag="Zarejestrowani" flagColor="pl"
          target={d.zarej_razem || 0} label="w miesiącu" />
        <KpiCard flag="Wyrejestrowani" flagColor="green"
          target={wyrej} label="w miesiącu" variant="green" />
        <KpiCard flag="Oferty pracy" flagColor="green"
          target={d.oferty_pracy || 0} label="wolne miejsca" variant="green" />
        <KpiCard flag="Pracujący ogółem" flagColor="green"
          target={d.wyn_pracujacy || 0} label="ZUS · I poł. 2025" variant="green" />
        <KpiCard flag="Śr. wynagrodzenie (UoP)" flagColor="green"
          target={Math.round(d.wyn_brutto || 0)} suffix=" zł"
          label="ZUS · I poł. 2025" variant="green" />
      </Grid>

      {/* ── Napływ/odpływ + Stopa bezrobocia ────────────────────────────── */}
      <Grid cols={2} style={{ marginBottom: '14px' }}>
        {trendZarej.some(v => v != null) && (
          <Card title="Napływ i odpływ — ostatnie 13 miesięcy">
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <ChartLabel color="#52b788" label={`Zarejestrowani (bież. ${fmt(d.zarej_razem)})`} />
              <ChartLabel color="#f4a261" label={`Wyrejestrowani (bież. ${fmt(wyrej)})`} />
            </div>
            <LineChartSVG
              datasets={[
                { data: trendZarej, color: '#52b788', label: 'Zarejestrowani' },
                { data: trendWyrej, color: '#f4a261', label: 'Wyrejestrowani' },
              ]}
              labels={trendLabels}
              height={145}
            />
          </Card>
        )}

        <Card title="Stopa bezrobocia — porównanie powiatów">
          <div style={{ marginBottom: '10px' }}>
            <PowiatSelector
              selected={cmpWgms}
              onChange={setCmpWgms}
              allPowiaty={powSorted}
              max={6}
            />
          </div>
          <LineChartSVG datasets={stopaDatasets} labels={trendLabels} height={145} />
        </Card>
      </Grid>

      {/* ── Przyczyny wyrejestrowania — full width ───────────────────────── */}
      {wyrejTop5.length > 0 && (
        <Card title={`Przyczyny wyrejestrowania · ${d.nazwa || ''}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {wyrejTop5.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '5px 10px',
                  background: i === 0 ? 'rgba(82,183,136,0.10)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  border: i === 0 ? '1px solid rgba(82,183,136,0.2)' : '1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: i === 0 ? 'var(--green)' : 'var(--blue)', flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '1px' }}>{r.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)' }}>
                      {fmt(r.n)}
                      <span style={{ fontWeight: 400, color: 'var(--muted)', marginLeft: '4px', fontSize: '0.65rem' }}>
                        {r.pct?.toFixed(1).replace('.', ',')}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <HorizontalBar
              data={wyrejBarData} unit=" os." colorFn={wyrejColorFn}
              barHeight={9} wrapLabel labelWidth={160}
            />
          </div>
        </Card>
      )}

      {/* ── Kategorie + Charakterystyka ─────────────────────────────────── */}
      <Grid cols={2} style={{ marginTop: '14px' }}>
        <Card title={`Kategorie bezrobotnych · ${d.nazwa || ''}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <GenderCell icon="♀" label="Kobiety"   n={kobiety}   total={bezr} color="#f4a261" />
            <GenderCell icon="♂" label="Mężczyźni" n={mezczyzni} total={bezr} color="#4895ef" />
          </div>
          <HorizontalBar
            data={kategorieData} unit=" os." colorFn={blueColor}
            barHeight={9} wrapLabel labelWidth={145}
          />
        </Card>

        <Card title="Charakterystyka bezrobotnych">
          {czasData.length > 0 && <MiniSection label="Czas pozostawania bez pracy" data={czasData} colorFn={blueColor} />}
          {wiekData.length > 0 && <MiniSection label="Wiek" data={wiekData} colorFn={greenColor} />}
          {wykData.length  > 0 && <MiniSection label="Wykształcenie" data={wykData} colorFn={blueColor} />}
          {stazData.length > 0 && <MiniSection label="Staż pracy ogółem" data={stazData} colorFn={greenColor} />}
        </Card>
      </Grid>
    </div>
  );
}
