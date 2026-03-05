export default function Card({ title, badge, badgeLive, children, style: extraStyle = {} }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-br)',
      borderRadius: '14px', padding: '18px 20px',
      transition: 'border-color 0.2s',
      ...extraStyle,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-br)'}
    >
      {(title || badge) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          {title && (
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.01em' }}>
              {title}
            </div>
          )}
          {badge && (
            <div style={{
              fontSize: '0.62rem',
              background: badgeLive ? 'rgba(82,183,136,0.12)' : 'rgba(255,255,255,0.06)',
              color: badgeLive ? 'var(--green)' : 'var(--muted)',
              border: badgeLive ? '1px solid rgba(82,183,136,0.2)' : 'none',
              padding: '3px 9px', borderRadius: '20px', fontWeight: 500,
            }}>
              {badge}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '3px' }}>{sub}</div>}
      <div style={{ width: '40px', height: '2px', background: 'var(--accent)', marginTop: '8px', borderRadius: '1px' }} />
    </div>
  );
}

export function Grid({ cols = 2, children, style: extraStyle = {} }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '14px', marginBottom: '14px',
      ...extraStyle,
    }}>
      {children}
    </div>
  );
}

export function Toggle({ options, active, onChange }) {
  return (
    <div style={{
      display: 'flex', background: 'rgba(255,255,255,0.05)',
      borderRadius: '8px', padding: '3px', gap: '2px',
    }}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            padding: '4px 12px', borderRadius: '6px',
            fontSize: '0.7rem', fontWeight: active === opt.id ? 600 : 500,
            color: active === opt.id ? '#fff' : 'var(--muted)',
            cursor: 'pointer', border: 'none',
            background: active === opt.id ? 'var(--accent)' : 'transparent',
            fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
