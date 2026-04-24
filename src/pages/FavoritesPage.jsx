import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import MealCard from '../components/MealCard';

function FavoritesPage() {
  const { favorites } = useFavoritesContext();

  return (
    <div className="container page-content">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        {favorites.length > 0 && (
          <span className="count-label">{favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">♥</span>
          <h3>No favorites yet</h3>
          <p>Hit the heart on any recipe to save it here for later.</p>
          <Link to="/" className="back-link">Browse Recipes</Link>
        </div>
      ) : (
        <div className="results-grid">
          {favorites.map(recipe => (
            <MealCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
