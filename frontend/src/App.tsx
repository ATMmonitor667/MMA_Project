import './App.css';
import FighterCard from './components/fighterCard';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
type FighterStats = {
  first_name: string;
  last_name: string;
  description: string;
  power: number;
  speed: number;
  durability: number;
  iq: number;
  image: string;
};

function App() {
  const testData: FighterStats = {
    first_name: 'Illia',
    last_name: 'Topuria',
    description: 'Powerful striker with a strong wrestling background.',
    power: 95,
    speed: 90,
    durability: 85,
    iq: 88,
    image: '/TOPURIA_ILIA_L_BELT_10-26.avif'
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FighterCard props={testData} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
