import { Navigate, Route, Routes } from 'react-router-dom';
import { FavoritesProvider, useFavoritesContext } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MealDetailPage from './pages/MealDetailPage';
import FavoritesPage from './pages/FavoritesPage';

function AppShell() {
  const { favorites } = useFavoritesContext();
  return (
    <div className="app-shell">
      <Navbar favCount={favorites.length} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/meal/:id" element={<MealDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <AppShell />
    </FavoritesProvider>
  );
}

export default App;
