import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRecipeById } from '../api/spoonacular';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

function getNutrient(nutrients, name) {
  const n = nutrients?.find(n => n.name === name);
  return n ? Math.round(n.amount) : null;
}

function MealDetailPage() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { t } = useLanguage();
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
    recipe.vegetarian  && t.detail.vegetarian,
    recipe.vegan       && t.detail.vegan,
    recipe.glutenFree  && t.detail.glutenFree,
    recipe.dairyFree   && t.detail.dairyFree,
    recipe.veryHealthy && t.detail.veryHealthy,
  ].filter(Boolean) : [];

  return (
    <div className="container page-content">
      <Link to="/" className="back-link">{t.detail.back}</Link>

      {loading && <div className="spinner" role="status" aria-label={t.results.loading} />}
      {error   && <p className="state-message error">{error}</p>}
      {!loading && !error && !recipe && <p className="state-message">{t.common.unknown}</p>}

      {!loading && !error && recipe && (
        <article className="meal-detail">
          <img src={recipe.image} alt={recipe.title} className="meal-detail-image" />

          <div className="meal-detail-content">
            <h1>{recipe.title}</h1>

            {recipe.cuisines?.length > 0 && (
              <div className="detail-tags">
                {recipe.cuisines.map(c => <span key={c}>{c}</span>)}
              </div>
            )}

            {dietTags.length > 0 && (
              <div className="detail-tags">
                {dietTags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
            )}

            <div className="detail-meta">
              {recipe.readyInMinutes && (
                <div className="stat-box">
                  <span className="stat-value">{recipe.readyInMinutes}</span>
                  <span className="stat-label">{t.detail.minutes}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="stat-box">
                  <span className="stat-value">{recipe.servings}</span>
                  <span className="stat-label">{t.detail.servings}</span>
                </div>
              )}
              {calories != null && (
                <div className="stat-box">
                  <span className="stat-value">{calories}</span>
                  <span className="stat-label">{t.detail.calories}</span>
                </div>
              )}
            </div>

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

            <button
              className={`fav-btn${isFavorite(recipe.id) ? ' active' : ''}`}
              style={{ position: 'static', width: 'auto', borderRadius: 10, padding: '8px 18px', height: 'auto', gap: 6 }}
              onClick={() => toggleFavorite(recipe)}
            >
              {isFavorite(recipe.id) ? t.common.saved : t.common.save}
            </button>

            {recipe.extendedIngredients?.length > 0 && (
              <>
                <h2>{t.detail.ingredients}</h2>
                <ul>
                  {recipe.extendedIngredients.map(ing => (
                    <li key={ing.id ?? ing.original}>{ing.original}</li>
                  ))}
                </ul>
              </>
            )}

            {steps.length > 0 ? (
              <>
                <h2>{t.detail.instructions}</h2>
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
                <h2>{t.detail.instructions}</h2>
                <p className="instructions">{recipe.instructions}</p>
              </>
            ) : null}

            {recipe.sourceUrl && (
              <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="youtube-link">
                {t.detail.viewOriginal}
              </a>
            )}
          </div>
        </article>
      )}
    </div>
  );
}

export default MealDetailPage;
