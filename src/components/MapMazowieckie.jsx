import { useState, useEffect } from 'react';
import { useAppData } from '../context/DataContext';

// Nazwa z mrpips_data.json → GeoJSON nazwa (plik powiaty_maz.geojson)
// GeoJSON: powiaty ziemskie lowercase, miasta z wielką literą
const POW_MAP = {
  'Białobrzeski':        'powiat białobrzeski',
  'Ciechanowski':        'powiat ciechanowski',
  'Garwoliński':         'powiat garwoliński',
  'Gostyniński':         'powiat gostyniński',
  'Grodziski':           'powiat grodziski',
  'Grójecki':            'powiat grójecki',
  'Kozienicki':          'powiat kozienicki',
  'Legionowski':         'powiat legionowski',
  'Lipski':              'powiat lipski',
  'Łosicki':             'powiat łosicki',
  'Makowski':            'powiat makowski',
  'Miński':              'powiat miński',
  'Mławski':             'powiat mławski',
  'Nowodworski':         'powiat nowodworski',
  'Ostrołęcki':          'powiat ostrołęcki',
  'Ostrowski':           'powiat ostrowski',
  'Otwocki':             'powiat otwocki',
  'Piaseczyński':        'powiat piaseczyński',
  'Płocki':              'powiat płocki',
  'Płoński':             'powiat płoński',
  'Pruszkowski':         'powiat pruszkowski',
  'Przasnyski':          'powiat przasnyski',
  'Przysuski':           'powiat przysuski',
  'Pułtuski':            'powiat pułtuski',
  'Radomski':            'powiat radomski',
  'Siedlecki':           'powiat siedlecki',
  'Sierpecki':           'powiat sierpecki',
  'Sochaczewski':        'powiat sochaczewski',
  'Sokołowski':          'powiat sokołowski',
  'Szydłowiecki':        'powiat szydłowiecki',
  'Warszawski zachodni': 'powiat warszawski zachodni',
  'Węgrowski':           'powiat węgrowski',
  'Wołomiński':          'powiat wołomiński',
  'Wyszkowski':          'powiat wyszkowski',
  'Zwoleński':           'powiat zwoleński',
  'Żuromiński':          'powiat żuromiński',
  'Żyrardowski':         'powiat żyrardowski',
  'm. Ostrołęka':        'powiat Ostrołęka',
  'm. Płock':            'powiat Płock',
  'm. Radom':            'powiat Radom',
  'm. Siedlce':          'powiat Siedlce',
  'm. Warszawa':         'powiat Warszawa',
};

const SVG_W = 540, SVG_H = 460;
const MID_LAT_RAD = 52 * Math.PI / 180;

function calcBbox(features) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  const scan = ([lon, lat]) => {
    if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
  };
  for (const f of features) {
    const g = f.geometry;
    const rings = g.type === 'Polygon' ? g.coordinates
                : g.type === 'MultiPolygon' ? g.coordinates.flat()
                : [];
    rings.forEach(r => r.forEach(scan));
  }
  return { minLon, maxLon, minLat, maxLat };
}

function makeProject(bbox) {
  const cos = Math.cos(MID_LAT_RAD);
  const lonSpan = (bbox.maxLon - bbox.minLon) * cos;
  const latSpan = bbox.maxLat - bbox.minLat;
  const scale = Math.min(SVG_W / lonSpan, SVG_H / latSpan) * 0.92;
  const offX = (SVG_W - lonSpan * scale) / 2;
  const offY = (SVG_H - latSpan * scale) / 2;
  return ([lon, lat]) => [
    (lon - bbox.minLon) * cos * scale + offX,
    (bbox.maxLat - lat) * scale + offY,
  ];
}

function geoToPath(geometry, project) {
  const ringToD = ring =>
    ring.map((pt, i) => `${i ? 'L' : 'M'}${project(pt).map(v => v.toFixed(1)).join(',')}`).join('') + 'Z';
  if (geometry.type === 'Polygon')
    return geometry.coordinates.map(ringToD).join(' ');
  if (geometry.type === 'MultiPolygon')
    return geometry.coordinates.flatMap(poly => poly.map(ringToD)).join(' ');
  return '';
}

function stopaColor(s, minS, maxS) {
  const t = Math.max(0, Math.min(1, (s - minS) / (maxS - minS)));
  const lo = [72, 149, 239];
  const hi = [193, 18, 31];
  return `rgb(${lo.map((v, i) => Math.round(v + t * (hi[i] - v))).join(',')})`;
}

export default function MapMazowieckie({ onPowiatClick }) {
  const { powiaty, loading } = useAppData();
  const [geoPaths, setGeoPaths] = useState([]);
  const [tooltip, setTooltip]   = useState(null);

  // Buduj lookup: GeoJSON nazwa → dane powiatu
  const dataByGeo = {};
  if (powiaty) {
    powiaty.forEach(p => {
      const geo = POW_MAP[p.nazwa];
      if (geo) dataByGeo[geo] = p;
    });
  }

  // Stopa min/max dla skali kolorów
  const stopaValues = powiaty?.filter(p => p.stopa != null).map(p => p.stopa) ?? [];
  const minS = stopaValues.length ? Math.min(...stopaValues) : 1;
  const maxS = stopaValues.length ? Math.max(...stopaValues) : 25;

  // Ładuj GeoJSON raz
  useEffect(() => {
    fetch('/data/powiaty_maz.geojson')
      .then(r => r.json())
      .then(data => {
        const bbox = calcBbox(data.features);
        const project = makeProject(bbox);
        setGeoPaths(data.features.map(f => ({
          d: geoToPath(f.geometry, project),
          geoNazwa: f.properties.nazwa,
        })));
      })
      .catch(e => console.error('GeoJSON load error:', e));
  }, []);

  const isEmpty = geoPaths.length === 0 || loading;

  return (
    <div style={{
      position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', overflow: 'hidden',
      height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      {tooltip && (
        <div style={{
          position: 'absolute', background: '#1a2235',
          border: '1px solid var(--border)', borderRadius: '8px',
          padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text)',
          zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          left: tooltip.x + 12, top: tooltip.y - 10,
        }}>
          <strong style={{ fontSize: '0.78rem' }}>{tooltip.nazwa}</strong><br />
          {tooltip.stopa != null
            ? <><span style={{ color: 'var(--muted)' }}>Stopa: </span>
                <strong style={{ color: '#4895ef', fontFamily: 'JetBrains Mono, monospace' }}>{tooltip.stopa.toFixed(1).replace('.', ',')}%</strong>
                &nbsp;·&nbsp;
                <span style={{ color: 'var(--muted)' }}>Bezrob.: </span>
                <strong style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {tooltip.bezr != null
                    ? tooltip.bezr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
                    : '–'}
                </strong>
              </>
            : <span style={{ color: 'var(--muted)' }}>brak danych</span>}
        </div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block', flex: 1, minHeight: 0 }}>
        {isEmpty && (
          <text x={SVG_W / 2} y={SVG_H / 2} textAnchor="middle"
            fill="var(--muted)" fontSize="13" fontFamily="Outfit, sans-serif">
            Ładowanie mapy…
          </text>
        )}
        {geoPaths.map((gp, i) => {
          const pow = dataByGeo[gp.geoNazwa];
          const hasData = pow && pow.stopa != null;
          return (
            <g key={i}
              style={{ cursor: hasData && onPowiatClick ? 'pointer' : 'default' }}
              onClick={() => {
                if (hasData && onPowiatClick) onPowiatClick({ n: pow.nazwa, s: pow.stopa, wgm: pow.wgm });
              }}
              onMouseEnter={e => {
                if (hasData) e.currentTarget.querySelector('path').style.opacity = '1';
                const wrap = e.currentTarget.closest('div');
                const wr = wrap.getBoundingClientRect();
                setTooltip({
                  nazwa: pow?.nazwa ?? gp.geoNazwa.replace(/^powiat\s*/i, ''),
                  stopa: pow?.stopa,
                  bezr:  pow?.bezr_razem,
                  x: e.clientX - wr.left,
                  y: e.clientY - wr.top,
                });
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('path').style.opacity = '0.88';
                setTooltip(null);
              }}
            >
              <path
                d={gp.d}
                fill={hasData ? stopaColor(pow.stopa, minS, maxS) : '#2a3550'}
                stroke="rgba(10,15,30,0.8)"
                strokeWidth="0.6"
                opacity="0.88"
                style={{ transition: 'opacity 0.12s' }}
              />
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', padding: '0 4px', flexShrink: 0 }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
          Kliknij powiat · szary = brak danych · najazd = szczegóły
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '5px', borderRadius: '3px', background: 'linear-gradient(to right, #4895ef, #c1121f)' }} />
          <span style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>{minS.toFixed(1).replace('.', ',')}% — {maxS.toFixed(1).replace('.', ',')}%</span>
        </div>
      </div>
    </div>
  );
}
