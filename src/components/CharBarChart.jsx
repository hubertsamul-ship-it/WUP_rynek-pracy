import { useState } from 'react';

function fmt(n) {
  if (n == null) return '—';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

const CATEGORIES = [
  { id: 'czas', label: 'Czas pozostawania bez pracy', color: '#4895ef' },
  { id: 'wiek', label: 'Wiek', color: '#f4a261' },
  { id: 'wyk',  label: 'Wykształcenie', color: '#52b788' },
  { id: 'staz', label: 'Staż pracy ogółem', color: '#9d4edd' },
];

// Icons for categories
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ICONS = {
  czas: ClockIcon,
  wiek: UserIcon,
  wyk: BookIcon,
  staz: BriefcaseIcon,
};

/**
 * Vertical bar chart for unemployment characteristics
 */
function VerticalBarChart({ data, color, maxValue }) {
  const chartHeight = 160;
  const barWidth = Math.min(40, Math.floor((100 / data.length) * 0.7));
  
  return (
    <div style={{ marginTop: '16px' }}>
      {/* Chart area */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: `${chartHeight}px`,
        padding: '0 8px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        {data.map((item, i) => {
          const heightPct = (item.value / maxValue) * 100;
          const pct = ((item.value / data.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: `${barWidth + 20}px`,
              }}
            >
              {/* Value label on top */}
              <div style={{
                fontSize: '0.6rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--muted)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
              }}>
                {pct}%
              </div>
              {/* Bar */}
              <div
                style={{
                  width: `${barWidth}px`,
                  height: `${Math.max(heightPct, 2)}%`,
                  background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.4s ease-out',
                  position: 'relative',
                }}
                title={`${item.label}: ${fmt(item.value)} (${pct}%)`}
              />
            </div>
          );
        })}
      </div>
      
      {/* X-axis labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 8px 0',
      }}>
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              maxWidth: `${barWidth + 20}px`,
              textAlign: 'center',
              fontSize: '0.55rem',
              color: 'var(--muted)',
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      
      {/* Legend with values */}
      <div style={{
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '6px',
      }}>
        {data.map((item, i) => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = ((item.value / total) * 100).toFixed(1).replace('.', ',');
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '4px',
                fontSize: '0.6rem',
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                background: color,
                opacity: 1 - (i * 0.1),
                flexShrink: 0,
              }} />
              <span style={{ color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--text)',
                fontWeight: 600,
              }}>
                {fmt(item.value)}
              </span>
              <span style={{ color: color, fontWeight: 500 }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Charakterystyka bezrobotnych with category selector and bar chart
 */
export default function CharBarChart({ czasData = [], wiekData = [], wykData = [], stazData = [] }) {
  const [selected, setSelected] = useState('czas');
  
  const dataMap = {
    czas: czasData,
    wiek: wiekData,
    wyk: wykData,
    staz: stazData,
  };
  
  const currentData = dataMap[selected] || [];
  const currentCategory = CATEGORIES.find(c => c.id === selected);
  const maxValue = Math.max(...currentData.map(d => d.value), 1);
  const total = currentData.reduce((s, d) => s + d.value, 0);
  
  return (
    <div>
      {/* Category selector */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '12px',
      }}>
        {CATEGORIES.map(cat => {
          const isActive = selected === cat.id;
          const IconComponent = ICONS[cat.id];
          const hasData = dataMap[cat.id]?.length > 0;
          
          if (!hasData) return null;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: isActive ? `1px solid ${cat.color}55` : '1px solid transparent',
                background: isActive ? `${cat.color}15` : 'rgba(255,255,255,0.04)',
                color: isActive ? cat.color : 'var(--muted)',
                fontSize: '0.68rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
            >
              <IconComponent />
              {cat.label}
            </button>
          );
        })}
      </div>
      
      {/* Summary stats */}
      <div style={{
        display: 'flex',
        gap: '16px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '6px',
        borderLeft: `3px solid ${currentCategory?.color || '#4895ef'}`,
      }}>
        <div>
          <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Razem
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text)',
          }}>
            {fmt(total)}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Kategorie
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1rem',
            fontWeight: 700,
            color: currentCategory?.color || 'var(--text)',
          }}>
            {currentData.length}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dominująca
          </div>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--text)',
          }}>
            {currentData.length > 0 ? [...currentData].sort((a, b) => b.value - a.value)[0]?.label : '—'}
          </div>
        </div>
      </div>
      
      {/* Bar chart */}
      {currentData.length > 0 && (
        <VerticalBarChart
          data={currentData}
          color={currentCategory?.color || '#4895ef'}
          maxValue={maxValue}
        />
      )}
    </div>
  );
}
