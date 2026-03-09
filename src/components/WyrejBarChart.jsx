import { useState } from 'react';

// Ikony dla każdej przyczyny
const ICONS = {
  'Podjęcie pracy': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  'Brak kontaktu z PUP': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  'Inne przyczyny': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  'Dobrowolna rezygnacja': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  'Wiek/prawa emery.': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  ),
  'Szkolenie i staż': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  'Niepodjęcie/przerwanie': () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

const DefaultIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Kolory dla przyczyn - pozytywne na zielono, negatywne na czerwono
const COLORS = {
  'Podjęcie pracy': '#52b788',        // zielony - pozytywny
  'Szkolenie i staż': '#4895ef',       // niebieski - neutralny/pozytywny
  'Brak kontaktu z PUP': '#e63946',   // czerwony - negatywny
  'Dobrowolna rezygnacja': '#f4a261', // pomaranczowy - neutralny
  'Wiek/prawa emery.': '#a78bfa',     // fioletowy - neutralny
  'Inne przyczyny': '#94a3b8',         // szary - neutralny
  'Niepodjęcie/przerwanie': '#ef4444', // czerwony - negatywny
};

const DEFAULT_COLOR = '#64748b';

function fmt(n) {
  if (n == null) return '—';
  return Math.round(n).toLocaleString('pl-PL');
}

export default function WyrejBarChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + (d.n || d.value || 0), 0);
  const maxVal = Math.max(...data.map(d => d.n || d.value || 0));

  // Sortuj malejąco
  const sorted = [...data].sort((a, b) => (b.n || b.value || 0) - (a.n || a.value || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Header z sumą */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '4px',
      }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ogółem wyrejestrowani
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text)',
        }}>
          {fmt(total)}
        </span>
      </div>

      {/* Lista przyczyn */}
      {sorted.map((item, i) => {
        const value = item.n || item.value || 0;
        const pct = item.pct != null ? item.pct : ((value / total) * 100);
        const barWidth = (value / maxVal) * 100;
        const color = COLORS[item.label] || DEFAULT_COLOR;
        const IconComponent = ICONS[item.label] || DefaultIcon;
        const isHovered = hoveredIdx === i;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
              transition: 'background 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Ikona */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              flexShrink: 0,
            }}>
              <IconComponent />
            </div>

            {/* Zawartość */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Etykieta i wartości */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '6px',
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--text)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '0.68rem',
                    color: color,
                    fontWeight: 600,
                  }}>
                    {pct.toFixed(1).replace('.', ',')}%
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                  }}>
                    {fmt(value)}
                  </span>
                </div>
              </div>

              {/* Pasek */}
              <div style={{
                height: '6px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${barWidth}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  borderRadius: '3px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Legenda na dole */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#52b788' }} />
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>Pozytywne</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e63946' }} />
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>Wymaga uwagi</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }} />
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>Inne</span>
        </div>
      </div>
    </div>
  );
}
