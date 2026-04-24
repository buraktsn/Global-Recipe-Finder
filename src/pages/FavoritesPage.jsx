import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import MealCard from '../components/MealCard';

function FavoritesPage() {
  const { favorites } = useFavoritesContext();
  const { t } = useLanguage();

  return (
    <div className="container page-content">
      <div className="favorites-header">
        <h1>{t.favorites.title}</h1>
        {favorites.length > 0 && (
          <span className="count-label">{t.favorites.savedCount(favorites.length)}</span>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">♥</span>
          <h3>{t.favorites.noFavorites}</h3>
          <p>{t.favorites.noFavoritesSubtitle}</p>
          <Link to="/" className="back-link">{t.favorites.browse}</Link>
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
