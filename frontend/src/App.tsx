import { useState, useEffect } from 'react';
import './App.css';

type Fighter = {
  id: string;
  first_name: string;
  second_name: string;
  power: number;
  speed: number;
  durability: number;
  intelligence: number;
  rating: number;
};

function App() {
  const [fighters, setFighters] = useState<Fighter[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        setFighters(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {fighters.map((f) => (
        <div key={f.id}>
          <h2>{f.first_name}</h2>
          <h2>{f.second_name}</h2>
          <h2>{f.power}</h2>
          <h2>{f.speed}</h2>
          <h2>{f.durability}</h2>
          <h2>{f.intelligence}</h2>
          <h2>{f.rating}</h2>
        </div>
      ))}
    </>
  );
}

export default App;
