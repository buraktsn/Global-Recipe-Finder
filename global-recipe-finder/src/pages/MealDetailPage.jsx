import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

function MealDetailPage() {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    const fetchMeal = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}/lookup.php?i=${mealId}`);
        if (!response.ok) {
          throw new Error('Unable to fetch meal details.');
        }

        const data = await response.json();
        if (!isCancelled) {
          setMeal(data.meals?.[0] ?? null);
        }
      } catch (mealError) {
        if (!isCancelled) {
          setError(mealError.message || 'Something went wrong while loading this meal.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchMeal();

    return () => {
      isCancelled = true;
    };
  }, [mealId]);

  const ingredients = useMemo(() => {
    if (!meal) {
      return [];
    }

    const list = [];
    for (let index = 1; index <= 20; index += 1) {
      const ingredient = meal[`strIngredient${index}`];
      const measure = meal[`strMeasure${index}`];
      if (ingredient && ingredient.trim()) {
        list.push(`${ingredient}${measure?.trim() ? ` - ${measure.trim()}` : ''}`);
      }
    }

    return list;
  }, [meal]);

  return (
    <div className="container page-content">
      <Link to="/" className="back-link">
        ← Back to search
      </Link>

      {loading && <p className="state-message">Loading meal details...</p>}
      {error && <p className="state-message error">{error}</p>}
      {!loading && !error && !meal && <p className="state-message">Meal not found.</p>}

      {!loading && !error && meal && (
        <article className="meal-detail">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-detail-image" />

          <div className="meal-detail-content">
            <h1>{meal.strMeal}</h1>
            <p>
              <strong>Area:</strong> {meal.strArea || 'Unknown'}
            </p>
            <p>
              <strong>Category:</strong> {meal.strCategory || 'Unknown'}
            </p>

            <h2>Ingredients</h2>
            <ul>
              {ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>

            <h2>Instructions</h2>
            <p className="instructions">{meal.strInstructions}</p>

            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="youtube-link"
              >
                Watch on YouTube
              </a>
            )}
          </div>
        </article>
      )}
    </div>
  );
}

export default MealDetailPage;