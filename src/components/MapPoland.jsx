import { useState, useEffect } from 'react';
import { WOJ_DATA } from '../data/mockData';

// WOJ_DATA display name → GeoJSON nazwa
const WOJ_MAP = {
  'Warmińsko-maz.':  'warmińsko-mazurskie',
  'Podkarpackie':    'podkarpackie',
  'Świętokrzyskie':  'świętokrzyskie',
  'Lubelskie':       'lubelskie',
  'Kujawsko-pom.':   'kujawsko-pomorskie',
  'Zachodniopom.':   'zachodniopomorskie',
  'Podlaskie':       'podlaskie',
  'Opolskie':        'opolskie',
  'Łódzkie':         'łódzkie',
  'Lubuskie':        'lubuskie',
  'Dolnośląskie':    'dolnośląskie',
  'Pomorskie':       'pomorskie',
  'Małopolskie':     'małopolskie',
  'Śląskie':         'śląskie',
  'Mazowieckie':     'mazowieckie',
  'Wielkopolskie':   'wielkopolskie',
};

// GeoJSON nazwa → stopa and display name
const STOPA = Object.fromEntries(WOJ_DATA.map(d => [WOJ_MAP[d.n], d.s]));
const DISP  = Object.fromEntries(WOJ_DATA.map(d => [WOJ_MAP[d.n], d.n]));

const SVG_W = 500, SVG_H = 390;
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
  const pad = 0.05;
  const scale = Math.min(SVG_W / lonSpan, SVG_H / latSpan) * (1 - pad * 2);
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
  const t = (s - minS) / (maxS - minS);
  const lo = [72, 149, 239];   // #4895ef – bright blue (low)
  const hi = [193, 18, 31];    // #c1121f – deep red (high)
  return `rgb(${lo.map((v, i) => Math.round(v + t * (hi[i] - v))).join(',')})`;
}

export default function MapPoland() {
  const [paths, setPaths] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  const minS = Math.min(...WOJ_DATA.map(d => d.s));
  const maxS = Math.max(...WOJ_DATA.map(d => d.s));

  useEffect(() => {
    fetch('/data/wojewodztwa.geojson')
      .then(r => r.json())
      .then(data => {
        const bbox = calcBbox(data.features);
        const project = makeProject(bbox);
        setPaths(data.features.map(f => ({
          d: geoToPath(f.geometry, project),
          nazwa: f.properties.nazwa,
          display: DISP[f.properties.nazwa] || f.properties.nazwa,
          stopa: STOPA[f.properties.nazwa] ?? null,
          isMaz: f.properties.nazwa === 'mazowieckie',
        })));
      })
      .catch(e => console.error('GeoJSON load error:', e));
  }, []);

  return (
    <div style={{ position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', overflow: 'hidden' }}>
      {tooltip && (
        <div style={{
          position: 'absolute', background: '#1a2235',
          border: '1px solid var(--border)', borderRadius: '8px',
          padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text)',
          zIndex: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          left: tooltip.x + 12, top: tooltip.y - 10,
        }}>
          {tooltip.display}<br />
          {tooltip.stopa !== null
            ? <strong style={{ color: '#4895ef', fontFamily: 'JetBrains Mono, monospace' }}>{tooltip.stopa.toFixed(1).replace('.', ',')}%</strong>
            : <span style={{ color: 'var(--muted)' }}>brak danych</span>}
        </div>
      )}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block', height: '270px' }}>
        {paths.length === 0 && (
          <text x={SVG_W / 2} y={SVG_H / 2} textAnchor="middle" fill="var(--muted)" fontSize="13" fontFamily="Outfit, sans-serif">
            Ładowanie mapy…
          </text>
        )}
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.stopa !== null ? stopaColor(p.stopa, minS, maxS) : '#2a3550'}
            stroke={p.isMaz ? '#e63946' : 'rgba(10,15,30,0.85)'}
            strokeWidth={p.isMaz ? 1.8 : 0.7}
            opacity={0.88}
            style={{ cursor: 'pointer', transition: 'opacity 0.12s' }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '1';
              const wrap = e.currentTarget.closest('div');
              const wr = wrap.getBoundingClientRect();
              setTooltip({ display: p.display, stopa: p.stopa, x: e.clientX - wr.left, y: e.clientY - wr.top });
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.88';
              setTooltip(null);
            }}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', padding: '0 4px' }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Najazd = szczegóły · Mazowieckie = czerwona obwódka</div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '50px', height: '5px', borderRadius: '3px', background: 'linear-gradient(to right, #4895ef, #c1121f)' }} />
          <span style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>{minS.toFixed(1).replace('.', ',')}% — {maxS.toFixed(1).replace('.', ',')}%</span>
        </div>
      </div>
    </div>
  );
}
