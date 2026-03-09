import React from 'react';

// ── SVG Icons for Navigation ─────────────────────────────────────────────────

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTrendDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconWallet = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const IconFactory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M17 18h1" />
    <path d="M12 18h1" />
    <path d="M7 18h1" />
  </svg>
);

const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </svg>
);

const NAV = [
  { id:'pulpit',        icon: IconDashboard, label:'Pulpit',             section:'Główne' },
  { id:'bezrobotni',    icon: IconUsers,     label:'Bezrobotni',         section:null },
  { id:'stopa',         icon: IconTrendDown, label:'Stopa bezrobocia',   section:null },
  { id:'pracujacy',     icon: IconBriefcase, label:'Pracujący',          section:null },
  { id:'wynagrodzenia', icon: IconWallet,    label:'Wynagrodzenia',      section:null },
  { id:'zwolnienia',    icon: IconFactory,   label:'Zwolnienia grupowe', section:null },
  { id:'powiaty',       icon: IconMap,       label:'Powiaty',            section:'Analityka' },
];

export default function Sidebar({ active, onNav, collapsed, onToggle }) {
  return (
    <div style={{
      width: collapsed ? '58px' : '220px',
      minWidth: collapsed ? '58px' : '220px',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'width 0.22s ease, min-width 0.22s ease',
      flexShrink: 0,
    }}>

      {/* Dekoracja */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,57,70,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Brand */}
      <div style={{
        padding: collapsed ? '18px 0' : '20px 16px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: '66px',
        flexShrink: 0,
        transition: 'padding 0.22s ease',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)',
          flexShrink: 0,
        }} />
        {!collapsed && (
          <div style={{ marginLeft: '10px', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
              Rynek Pracy<br />Mazowsza
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
              WUP Warszawa · dane aktualne
            </div>
          </div>
        )}
      </div>

      {/* Nawigacja */}
      <div style={{ padding: collapsed ? '10px 6px' : '12px 8px', flex: 1, overflowY: 'auto' }}>
        {NAV.map((item, i) => (
          <React.Fragment key={item.id}>
            {item.section && !collapsed && (
              <div style={{
                fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--muted)',
                margin: `${i === 0 ? '0' : '12px'} 6px 5px`,
              }}>
                {item.section}
              </div>
            )}
            {item.section && collapsed && i !== 0 && (
              <div style={{ height: '1px', background: 'var(--border)', margin: '5px 6px' }} />
            )}
            <NavItem
              item={item}
              isActive={active === item.id}
              onClick={() => onNav(item.id)}
              collapsed={collapsed}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: collapsed ? '8px 6px' : '10px 12px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        {!collapsed ? (
          <>
            <button style={{
              width: '100%', padding: '7px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--muted2)', fontSize: '0.7rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.2s',
            }}>↺ Odśwież dane</button>
            <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {['Bezrobotni · Sty 2026', 'Stopa · Sty 2026', 'Zwolnienia · Gru 2025'].map(s => (
                <div key={s} style={{ fontSize: '0.62rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0, display: 'inline-block' }} />
                  {s}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{
              width: '34px', height: '34px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--muted2)', fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Odśwież dane">↺</button>
          </div>
        )}
      </div>

      {/* Przycisk toggle — na prawej krawędzi */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Rozwiń panel' : 'Zwiń panel'}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-1px',
          transform: 'translateY(-50%)',
          width: '16px',
          height: '48px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderLeft: 'none',
          borderRadius: '0 6px 6px 0',
          color: 'var(--muted)',
          cursor: 'pointer',
          fontSize: '0.6rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s, background 0.15s',
          lineHeight: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = 'var(--text)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--bg2)';
          e.currentTarget.style.color = 'var(--muted)';
        }}
      >
        {collapsed ? '›' : '‹'}
      </button>
    </div>
  );
}

function NavItem({ item, isActive, onClick, collapsed }) {
  const IconComponent = item.icon;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : '9px',
        padding: collapsed ? '5px 0' : '7px 8px',
        borderRadius: '9px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '1px',
        position: 'relative',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: isActive ? 'rgba(232,57,70,0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(232,57,70,0.2)' : '1px solid transparent',
      }}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {isActive && !collapsed && (
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '3px', height: '55%', background: 'var(--accent)', borderRadius: '0 2px 2px 0',
        }} />
      )}
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        background: isActive ? 'rgba(232,57,70,0.2)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.2s',
        color: isActive ? 'var(--accent)' : 'var(--muted)',
      }}>
        <IconComponent />
      </div>
      {!collapsed && (
        <span style={{
          fontSize: '0.76rem', fontWeight: isActive ? 600 : 500,
          color: isActive ? 'var(--text)' : 'var(--muted2)',
          transition: 'color 0.2s',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          {item.label}
        </span>
      )}
    </div>
  );
}
