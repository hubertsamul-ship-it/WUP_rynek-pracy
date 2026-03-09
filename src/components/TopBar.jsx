const TITLES = {
  pulpit:       'Pulpit — przegląd ogólny',
  bezrobotni:   'Bezrobotni — MRPiPS',
  stopa:        'Stopa bezrobocia — GUS',
  pracujacy:    'Pracujący — zatrudnienie',
  wynagrodzenia:'Wynagrodzenia — sektor przedsiębiorstw',
  zwolnienia:   'Zwolnienia grupowe',
  powiaty:      'Analityka powiatowa',
};

const SUBTITLES = {
  pulpit:       'Najświeższe dane o rynku pracy',
  bezrobotni:   'Dane z rejestrów powiatowych urzędów pracy',
  stopa:        'Główny Urząd Statystyczny',
  pracujacy:    'ZUS Blender Danych',
  wynagrodzenia:'ZUS Blender Danych',
  zwolnienia:   'WUP Mazowsze',
  powiaty:      'Szczegółowa analiza wybranego powiatu',
};

// Calendar icon
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function TopBar({ page }) {
  return (
    <div style={{
      height: '56px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
      background: 'var(--bg2)',
    }}>
      <div>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.05rem', color: 'var(--text)', letterSpacing: '0.01em',
          lineHeight: 1.2,
        }}>
          {TITLES[page] || page}
        </div>
        <div style={{
          fontSize: '0.65rem', color: 'var(--muted)',
          marginTop: '2px',
        }}>
          {SUBTITLES[page] || ''}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.72rem', color: 'var(--muted)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <CalendarIcon />
          Styczeń 2026
        </div>
        <div style={{
          background: 'rgba(82,183,136,0.12)',
          border: '1px solid rgba(82,183,136,0.25)',
          borderRadius: '20px', padding: '4px 12px',
          fontSize: '0.65rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--green)',
            animation: 'pulse 2s infinite',
          }} />
          LIVE
        </div>
      </div>
    </div>
  );
}
