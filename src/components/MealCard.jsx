import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';

function MealCard({ recipe }) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const calories = recipe.nutrition?.nutrients?.find(n => n.name === 'Calories');

  const tags = [
    recipe.vegetarian && 'Vegetarian',
    recipe.vegan && 'Vegan',
    recipe.glutenFree && 'Gluten Free',
  ].filter(Boolean);

  function handleFavClick(e) {
    e.preventDefault();
    toggleFavorite(recipe);
  }

  return (
    <div className="meal-card-wrapper">
      <Link to={`/meal/${recipe.id}`} className="meal-card">
        <div style={{ position: 'relative' }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            className="meal-image"
          />
          {calories && (
            <span className="calorie-badge">{Math.round(calories.amount)} kcal</span>
          )}
        </div>
        <div className="meal-content">
          <h3>{recipe.title}</h3>
          {recipe.cuisines?.length > 0 && (
            <p className="meal-area">{recipe.cuisines.join(', ')}</p>
          )}
          {recipe.readyInMinutes && (
            <p className="meal-area" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              ⏱ {recipe.readyInMinutes} min
            </p>
          )}
          {tags.length > 0 && (
            <div className="meal-tags">
              {tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </div>
      </Link>
      <button
        className={`fav-btn${isFavorite(recipe.id) ? ' active' : ''}`}
        onClick={handleFavClick}
        aria-label={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite(recipe.id) ? '♥' : '♡'}
      </button>
    </div>
  );
}

export default MealCard;
