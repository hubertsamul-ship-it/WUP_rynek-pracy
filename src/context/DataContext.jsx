/**
 * DataContext — jedyne źródło danych dynamicznych aplikacji.
 * Ładuje public/data/dashboard_final.json (pre-computed przez Python)
 * i udostępnia przez hook useAppData() we wszystkich komponentach.
 *
 * Sekcje dashboard_final.json:
 *   pulpit       — KPI + trend 37m + mapa Mazowsza
 *   bezrobotni   — KPI + kategorie + charakterystyka D5
 *   stopa        — KPI + rankingi powiatów + trend 13m
 *   wynagrodzenia — dane ZUS
 *   powiaty_lista — 42 powiaty z trendem 13m (dla MapMazowieckie)
 */
import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);

export function DataProvider({ children }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetch('/data/dashboard_final.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const value = {
    // Sekcje pre-computed
    pulpit:        data?.pulpit        ?? null,
    bezrobotni:    data?.bezrobotni    ?? null,
    stopa:         data?.stopa         ?? null,
    wynagrodzenia: data?.wynagrodzenia ?? null,
    pracujacy:        data?.pracujacy        ?? null,
    wynagrodzenia_kpi: data?.wynagrodzenia_kpi ?? null,
    zwolnienia:    data?.zwolnienia    ?? null,
    // Lista powiatów — używana przez MapMazowieckie (pola: wgm, nazwa, stopa, bezr_razem)
    powiaty:       data?.powiaty_lista ?? [],
    loading,
    error,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAppData = () => useContext(Ctx);
