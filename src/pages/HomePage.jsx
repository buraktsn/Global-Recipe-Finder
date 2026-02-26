import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import SearchTabs from '../components/SearchTabs';
import MealCard from '../components/MealCard';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

async function fetchMealDetailsByIds(ids) {
  const requests = ids.map(async (id) => {
    const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch meal details.');
    }

    const data = await response.json();
    return data.meals?.[0] ?? null;
  });

  const detailedMeals = await Promise.all(requests);
  return detailedMeals.filter(Boolean);
}

function getMealIngredientSet(meal) {
  const ingredients = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim().toLowerCase());
    }
  }

  return new Set(ingredients);
}

function HomePage() {
  const [activeTab, setActiveTab] = useState('meal');
  const [query, setQuery] = useState('');
  const [ingredientInputs, setIngredientInputs] = useState(['']);
  const [meals, setMeals] = useState([]);
  const [fullMatchMeals, setFullMatchMeals] = useState([]);
  const [partialMatchMeals, setPartialMatchMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      if (activeTab === 'meal') {
        const cleanedQuery = query.trim();
        if (!cleanedQuery) {
          setMeals([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(cleanedQuery)}`);
        if (!response.ok) {
          throw new Error('Unable to search meals by name.');
        }

        const data = await response.json();
        setMeals(data.meals ?? []);
        setFullMatchMeals([]);
        setPartialMatchMeals([]);
      } else {
        const userIngredients = ingredientInputs
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean);

        if (userIngredients.length === 0) {
          setFullMatchMeals([]);
          setPartialMatchMeals([]);
          setLoading(false);
          return;
        }

        const uniqueUserIngredients = [...new Set(userIngredients)];

        const filterRequests = uniqueUserIngredients.map(async (ingredient) => {
          const response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
          if (!response.ok) {
            throw new Error('Unable to search meals by ingredient.');
          }

          const data = await response.json();
          return data.meals ?? [];
        });

        const ingredientResponses = await Promise.all(filterRequests);
        const uniqueMealIds = new Set();

        ingredientResponses.forEach((ingredientMeals) => {
          ingredientMeals.forEach((meal) => uniqueMealIds.add(meal.idMeal));
        });

        const detailedMeals = await fetchMealDetailsByIds([...uniqueMealIds]);

        const scoredMeals = detailedMeals
          .map((meal) => {
            const mealIngredients = getMealIngredientSet(meal);
            const matchCount = uniqueUserIngredients.reduce(
              (count, ingredient) => (mealIngredients.has(ingredient) ? count + 1 : count),
              0
            );
            const matchScore = matchCount / uniqueUserIngredients.length;

            return { meal, matchScore };
          })
          .filter((item) => item.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore);

        const fullMatches = scoredMeals
          .filter((item) => item.matchScore === 1)
          .map((item) => item.meal);

        const partialMatches = scoredMeals
          .filter((item) => item.matchScore < 1)
          .map((item) => item.meal);

        setMeals([]);
        setFullMatchMeals(fullMatches);
        setPartialMatchMeals(partialMatches);
      }
    } catch (searchError) {
      setError(searchError.message || 'Something went wrong. Please try again.');
      setMeals([]);
      setFullMatchMeals([]);
      setPartialMatchMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const totalIngredientResults = fullMatchMeals.length + partialMatchMeals.length;

  return (
    <div className="container page-content">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Discover Recipes From Around the World</h1>
          <p>Find the best recipes based on your ingredients</p>
        </div>
      </section>

      <section className="search-section">
        <p className="search-lead">Search by meal name or ingredient and discover new dishes.</p>
        <SearchTabs
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            setMeals([]);
            setFullMatchMeals([]);
            setPartialMatchMeals([]);
            setHasSearched(false);
            setError('');
          }}
        />
        <SearchForm
          activeTab={activeTab}
          query={query}
          onQueryChange={setQuery}
          ingredients={ingredientInputs}
          onIngredientChange={(index, value) => {
            setIngredientInputs((previous) =>
              previous.map((item, itemIndex) => (itemIndex === index ? value : item))
            );
          }}
          onAddIngredient={() => {
            setIngredientInputs((previous) => [...previous, '']);
          }}
          onRemoveIngredient={(index) => {
            setIngredientInputs((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
          }}
          onSearch={handleSearch}
        />
      </section>

      <section className="results-section" aria-live="polite">
        {loading && <p className="state-message">Loading recipes...</p>}
        {error && <p className="state-message error">{error}</p>}

        {!loading && !error && hasSearched && activeTab === 'meal' && meals.length === 0 && (
          <p className="state-message">No results found. Try a different search term.</p>
        )}

        {!loading && !error && hasSearched && activeTab === 'ingredient' && totalIngredientResults === 0 && (
          <p className="state-message">No results found. Try different ingredients.</p>
        )}

        {!loading && !error && activeTab === 'meal' && (
          <div className="results-grid">
            {meals.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        )}

        {!loading && !error && activeTab === 'ingredient' && hasSearched && totalIngredientResults > 0 && (
          <div className="ingredient-results">
            {fullMatchMeals.length > 0 && (
              <div className="result-section">
                <h2>You Can Make With Your Ingredients</h2>
                <div className="results-grid">
                  {fullMatchMeals.map((meal) => (
                    <MealCard key={meal.idMeal} meal={meal} />
                  ))}
                </div>
              </div>
            )}

            {partialMatchMeals.length > 0 && (
              <div className="result-section">
                <h2>Closest Matching Recipes</h2>
                <div className="results-grid">
                  {partialMatchMeals.map((meal) => (
                    <MealCard key={meal.idMeal} meal={meal} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;