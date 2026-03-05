import { useState } from 'react';
import './index.css';
import { DataProvider } from './context/DataContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Pulpit from './pages/Pulpit';
import Bezrobotni from './pages/Bezrobotni';
import Stopa from './pages/Stopa';
import Pracujacy from './pages/Pracujacy';
import Wynagrodzenia from './pages/Wynagrodzenia';
import Zwolnienia from './pages/Zwolnienia';
import Powiaty from './pages/Powiaty';

export default function App() {
  const [page, setPage] = useState('pulpit');
  const [powiatTarget, setPowiatTarget] = useState(null);

  function handleNavPowiaty(powData) {
    if (powData.wgm) setPowiatTarget(powData.wgm);
    setPage('powiaty');
  }

  const pages = {
    pulpit:       <Pulpit onNavPowiaty={handleNavPowiaty} />,
    bezrobotni:   <Bezrobotni />,
    stopa:        <Stopa />,
    pracujacy:    <Pracujacy />,
    wynagrodzenia:<Wynagrodzenia />,
    zwolnienia:   <Zwolnienia />,
    powiaty:      <Powiaty initialPowiat={powiatTarget} key={powiatTarget} />,
  };

  return (
    <DataProvider>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <Sidebar active={page} onNav={setPage} />
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TopBar page={page} />
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px' }}>
            {pages[page]}
          </div>
        </div>
      </div>
    </DataProvider>
  );
}
