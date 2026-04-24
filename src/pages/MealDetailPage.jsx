import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRecipeById } from '../api/spoonacular';
import { useFavoritesContext } from '../context/FavoritesContext';

function getNutrient(nutrients, name) {
  const n = nutrients?.find(n => n.name === name);
  return n ? Math.round(n.amount) : null;
}

function MealDetailPage() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    getRecipeById(id)
      .then(data => { if (!cancelled) setRecipe(data); })
      .catch(err => { if (!cancelled) setError(err.message || 'Failed to load recipe.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const nutrients = recipe?.nutrition?.nutrients;
  const calories  = getNutrient(nutrients, 'Calories');
  const protein   = getNutrient(nutrients, 'Protein');
  const fat       = getNutrient(nutrients, 'Fat');
  const carbs     = getNutrient(nutrients, 'Carbohydrates');

  const steps = recipe?.analyzedInstructions?.[0]?.steps ?? [];

  const dietTags = recipe ? [
    recipe.vegetarian  && 'Vegetarian',
    recipe.vegan       && 'Vegan',
    recipe.glutenFree  && 'Gluten Free',
    recipe.dairyFree   && 'Dairy Free',
    recipe.veryHealthy && 'Very Healthy',
  ].filter(Boolean) : [];

  return (
    <div className="container page-content">
      <Link to="/" className="back-link">← Back to search</Link>

      {loading && <div className="spinner" role="status" aria-label="Loading" />}
      {error   && <p className="state-message error">{error}</p>}
      {!loading && !error && !recipe && <p className="state-message">Recipe not found.</p>}

      {!loading && !error && recipe && (
        <article className="meal-detail">
          <img src={recipe.image} alt={recipe.title} className="meal-detail-image" />

          <div className="meal-detail-content">
            <h1>{recipe.title}</h1>

            {/* Cuisine tags */}
            {recipe.cuisines?.length > 0 && (
              <div className="detail-tags">
                {recipe.cuisines.map(c => <span key={c}>{c}</span>)}
              </div>
            )}

            {/* Diet tags */}
            {dietTags.length > 0 && (
              <div className="detail-tags">
                {dietTags.map(t => <span key={t}>{t}</span>)}
              </div>
            )}

            {/* Stats */}
            <div className="detail-meta">
              {recipe.readyInMinutes && (
                <div className="stat-box">
                  <span className="stat-value">{recipe.readyInMinutes}</span>
                  <span className="stat-label">Min</span>
                </div>
              )}
              {recipe.servings && (
                <div className="stat-box">
                  <span className="stat-value">{recipe.servings}</span>
                  <span className="stat-label">Servings</span>
                </div>
              )}
              {calories != null && (
                <div className="stat-box">
                  <span className="stat-value">{calories}</span>
                  <span className="stat-label">Calories</span>
                </div>
              )}
            </div>

            {/* Nutrition pills */}
            {(protein != null || fat != null || carbs != null) && (
              <div className="nutrition-row">
                {protein != null && (
                  <span className="nutrition-pill">
                    <span className="pill-label">Protein</span> {protein}g
                  </span>
                )}
                {fat != null && (
                  <span className="nutrition-pill">
                    <span className="pill-label">Fat</span> {fat}g
                  </span>
                )}
                {carbs != null && (
                  <span className="nutrition-pill">
                    <span className="pill-label">Carbs</span> {carbs}g
                  </span>
                )}
              </div>
            )}

            {/* Favorite button */}
            <button
              className={`fav-btn${isFavorite(recipe.id) ? ' active' : ''}`}
              style={{ position: 'static', width: 'auto', borderRadius: 10, padding: '8px 18px', height: 'auto', gap: 6 }}
              onClick={() => toggleFavorite(recipe)}
            >
              {isFavorite(recipe.id) ? '♥ Saved' : '♡ Save to Favorites'}
            </button>

            {/* Ingredients */}
            {recipe.extendedIngredients?.length > 0 && (
              <>
                <h2>Ingredients</h2>
                <ul>
                  {recipe.extendedIngredients.map(ing => (
                    <li key={ing.id ?? ing.original}>{ing.original}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Instructions */}
            {steps.length > 0 ? (
              <>
                <h2>Instructions</h2>
                <ol className="steps-list">
                  {steps.map(step => (
                    <li key={step.number}>
                      <span className="step-number">{step.number}</span>
                      <span className="step-text">{step.step}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : recipe.instructions ? (
              <>
                <h2>Instructions</h2>
                <p className="instructions">{recipe.instructions}</p>
              </>
            ) : null}

            {/* Source link */}
            {recipe.sourceUrl && (
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="youtube-link"
              >
                View Full Recipe Source ↗
              </a>
            )}
          </div>
        </article>
      )}
    </div>
  );
}

export default MealDetailPage;
