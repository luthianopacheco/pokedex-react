import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/general/layout';
import PokemonDetailPage from './pages/pokemonDetailPage/pokemonDetailPage';
import HomePage from './pages/homePage/homePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="pokemon/:nameOrId" element={<PokemonDetailPage />} />
          <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}