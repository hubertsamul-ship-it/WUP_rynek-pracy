import React from 'react';

const NAV = [
  { id:'pulpit',       icon:'⬛', label:'Pulpit',             section:'Główne' },
  { id:'bezrobotni',   icon:'👥', label:'Bezrobotni',         section:null },
  { id:'stopa',        icon:'📉', label:'Stopa bezrobocia',   section:null },
  { id:'pracujacy',    icon:'💼', label:'Pracujący',          section:null },
  { id:'wynagrodzenia',icon:'💰', label:'Wynagrodzenia',      section:null },
  { id:'zwolnienia',   icon:'🏭', label:'Zwolnienia grupowe', section:null },
  { id:'powiaty',      icon:'🗺️', label:'Powiaty',           section:'Analityka' },
];

export default function Sidebar({ active, onNav }) {
  const style = {
    sidebar: {
      width: '220px', minWidth: '220px',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    },
    before: {
      content: "''", position: 'absolute', top: '-60px', left: '-60px',
      width: '200px', height: '200px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(232,57,70,0.12), transparent 70%)',
      pointerEvents: 'none',
    },
    brand: {
      padding: '24px 18px 20px',
      borderBottom: '1px solid var(--border)',
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
    dot: {
      width: '8px', height: '8px', borderRadius: '50%',
      background: 'var(--accent)',
      boxShadow: '0 0 10px var(--accent)',
    },
    nav: { padding: '14px 10px', flex: 1, overflowY: 'auto' },
    section: {
      fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: 'var(--muted)',
      margin: '10px 8px 6px',
    },
    footer: { padding: '12px', borderTop: '1px solid var(--border)' },
    btn: {
      width: '100%', padding: '8px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid var(--border)', borderRadius: '8px',
      color: 'var(--muted2)', fontSize: '0.72rem', fontWeight: 500,
      cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
      transition: 'all 0.2s',
    },
    status: { marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' },
  };

  return (
    <div style={style.sidebar}>
      <div style={style.before} />
      <div style={style.brand}>
        <div style={style.logoRow}>
          <div style={style.dot} />
          <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Obserwatorium
          </span>
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginTop: '2px' }}>
          Rynek Pracy<br />Mazowsza
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '2px' }}>
          WUP Warszawa · dane aktualne
        </div>
      </div>

      <div style={style.nav}>
        {NAV.map((item, i) => (
          <React.Fragment key={item.id}>
            {item.section && (
              <div style={{ ...style.section, marginTop: i === 0 ? '0' : '14px' }}>
                {item.section}
              </div>
            )}
            <NavItem item={item} isActive={active === item.id} onClick={() => onNav(item.id)} />
          </React.Fragment>
        ))}
      </div>

      <div style={style.footer}>
        <button style={style.btn}>↺ Odśwież dane</button>
        <div style={style.status}>
          {['Bezrobotni · Sty 2026', 'Stopa · Sty 2026', 'Zwolnienia · Gru 2025'].map(s => (
            <div key={s} style={{
              fontSize: '0.64rem', color: 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0, display: 'inline-block' }} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItem({ item, isActive, onClick }) {
  const base = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 10px', borderRadius: '10px',
    cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1px',
    position: 'relative',
  };
  const active = {
    background: 'rgba(232,57,70,0.1)',
    border: '1px solid rgba(232,57,70,0.2)',
  };
  const inactive = {
    background: 'transparent',
    border: '1px solid transparent',
  };

  return (
    <div
      style={{ ...base, ...(isActive ? active : inactive) }}
      onClick={onClick}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {isActive && (
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '3px', height: '60%', background: 'var(--accent)', borderRadius: '0 2px 2px 0',
        }} />
      )}
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px',
        background: isActive ? 'rgba(232,57,70,0.2)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem', flexShrink: 0, transition: 'all 0.2s',
      }}>
        {item.icon}
      </div>
      <span style={{
        fontSize: '0.78rem', fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--text)' : 'var(--muted2)',
        transition: 'color 0.2s',
      }}>
        {item.label}
      </span>
    </div>
  );
}
