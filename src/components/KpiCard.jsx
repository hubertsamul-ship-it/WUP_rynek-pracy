import { useEffect, useRef, useState } from 'react';

function useCountUp(target, decimals = 0, duration = 1200) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let startTs = null;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(target * ease);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  if (decimals > 0) return (val / Math.pow(10, decimals)).toFixed(1).replace('.', ',');
  // Liczba całkowita: separator tysięcy twardą spacją (niezawodne cross-browser)
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

const ACCENT_MAP = {
  blue:  { after: 'rgba(72,149,239,0.06)' },
  red:   { after: 'rgba(232,57,70,0.07)' },
  green: { after: 'rgba(82,183,136,0.07)' },
  orange:{ after: 'rgba(244,162,97,0.07)' },
};

const FLAG_COLORS = {
  pl:    'var(--blue)',
  maz:   'var(--accent)',
  waw:   'var(--accent2)',
  green: 'var(--green)',
};

export default function KpiCard({
  flag, flagColor = 'pl',
  target, decimals = 0, suffix = '',
  label, delta, deltaType = 'up',
  variant,   // 'red' | 'green' | 'blue' | undefined
  style: extraStyle = {},
}) {
  const displayed = useCountUp(target, decimals);
  const accentRgba = ACCENT_MAP[variant]?.after || ACCENT_MAP.blue.after;

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-br)',
      borderRadius: '14px', padding: '22px 24px',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
      ...extraStyle,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-br)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* glow orb */}
      <div style={{
        position: 'absolute', bottom: '-30px', right: '-30px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: `radial-gradient(circle, ${accentRgba}, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* flag */}
      <div style={{
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: FLAG_COLORS[flagColor] || 'var(--muted)',
        marginBottom: '8px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
        {flag}
      </div>

      {/* number */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '2.6rem', fontWeight: 700, color: 'var(--text)',
        lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {displayed}
        {suffix && <span style={{ fontSize: '1rem', color: 'var(--muted2)', fontWeight: 400, marginLeft: '4px' }}>{suffix}</span>}
      </div>

      {/* label */}
      <div style={{ fontSize: '0.72rem', color: 'var(--muted2)', marginTop: '6px', fontWeight: 400 }}>
        {label}
      </div>

      {/* delta */}
      {delta && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          marginTop: '8px', padding: '3px 10px', borderRadius: '20px',
          fontSize: '0.68rem', fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          ...(deltaType === 'up'
            ? { background: 'rgba(232,57,70,0.12)', color: '#ef4444', border: '1px solid rgba(232,57,70,0.2)' }
            : deltaType === 'dn'
              ? { background: 'rgba(82,183,136,0.12)', color: 'var(--green)', border: '1px solid rgba(82,183,136,0.2)' }
              : { background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', border: '1px solid var(--border)' }
          ),
        }}>
          {delta}
        </div>
      )}
    </div>
  );
}
