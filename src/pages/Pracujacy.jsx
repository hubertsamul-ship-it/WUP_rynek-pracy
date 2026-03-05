import KpiCard from '../components/KpiCard';
import Card, { SectionHeader, Grid } from '../components/Card';
import HorizontalBar, { blueColor, greenColor, stopaColor } from '../components/HorizontalBar';
import { useAppData } from '../context/DataContext';

const fmtPct = v => v?.toFixed(2).replace('.', ',') + '%';
const toBar  = arr => arr.map(r => ({ label: r.label, value: r.value }));

export default function Pracujacy() {
  const { pracujacy } = useAppData();
  if (!pracujacy) return null;

  const {
    razem, pct_uop, n_uop, pct_cywil, n_cywil, pct_dg, n_dg,
    top5_pracujacy, bot5_pracujacy,
    top5_zawody_pracujacy, top5_zawody_uop,
    top5_pow_cywil, top5_zawody_dg,
  } = pracujacy;

  return (
    <div className="page-enter">
      <SectionHeader
        title="Pracujący"
        sub="ZUS · Blender Danych · województwo mazowieckie · I poł. 2025"
      />

      {/* KPI */}
      <Grid cols={4} style={{ marginBottom: '14px' }}>
        <KpiCard flag="Pracujący ogółem" flagColor="green"
          target={razem} label="Mazowieckie · I poł. 2025" variant="green" />
        <KpiCard flag="Umowy o pracę" flagColor="maz"
          target={n_uop} label={`${fmtPct(pct_uop)} pracujących`} />
        <KpiCard flag="Cywilnoprawne" flagColor="pl"
          target={n_cywil} label={`${fmtPct(pct_cywil)} pracujących`} />
        <KpiCard flag="Dział. gospodarcza" flagColor="maz"
          target={n_dg} label={`${fmtPct(pct_dg)} pracujących`} />
      </Grid>

      {/* Rankingi powiatów — liczba pracujących */}
      <Grid cols={2} style={{ marginBottom: '14px' }}>
        <Card title="TOP 5 powiatów wg liczby pracujących" badge="Top 5">
          <HorizontalBar data={toBar(top5_pracujacy)} unit=" os." colorFn={blueColor} />
        </Card>
        <Card title="5 powiatów z najmniejszą liczbą pracujących" badge="Bot 5">
          <HorizontalBar data={toBar(bot5_pracujacy)} unit=" os." colorFn={greenColor} />
        </Card>
      </Grid>

      {/* Rankingi zawodów */}
      <Grid cols={2} style={{ marginBottom: '14px' }}>
        <Card title="TOP 5 zawodów wg liczby pracujących" badge="Top 5">
          <HorizontalBar data={toBar(top5_zawody_pracujacy)} unit=" os." colorFn={blueColor} wrapLabel />
        </Card>
        <Card title="TOP 5 zawodów z dominacją umów o pracę" badge="UoP">
          <HorizontalBar data={toBar(top5_zawody_uop)} unit="%" colorFn={greenColor} wrapLabel />
        </Card>
      </Grid>

      {/* Cywilnoprawne + DG */}
      <Grid cols={2}>
        <Card title="TOP 5 powiatów wg szac. liczby cywilnoprawnych" badge="Cywil.">
          <HorizontalBar data={toBar(top5_pow_cywil)} unit=" os." colorFn={blueColor} />
        </Card>
        <Card title="TOP 5 zawodów z dominacją działalności gosp." badge="DG">
          <HorizontalBar data={toBar(top5_zawody_dg)} unit="%" colorFn={stopaColor} wrapLabel />
        </Card>
      </Grid>
    </div>
  );
}
