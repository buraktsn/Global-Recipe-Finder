import { useState } from 'react';
import { searchRecipes } from '../api/spoonacular';
import SearchForm from '../components/SearchForm';
import SearchTabs from '../components/SearchTabs';
import FilterPanel from '../components/FilterPanel';
import MealCard from '../components/MealCard';

const EMPTY_FILTERS = {
  minCalories: '',
  maxCalories: '',
  excludeIngredients: [''],
  cuisines: [],
};

const PAGE_SIZE = 12;

function HomePage() {
  const [activeTab, setActiveTab] = useState('meal');
  const [query, setQuery] = useState('');
  const [ingredientInputs, setIngredientInputs] = useState(['']);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [recipes, setRecipes] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  function buildParams(currentOffset = 0, searchQuery = '', searchIngredients = []) {
    const exclude = filters.excludeIngredients.filter(v => v.trim()).join(',');
    return {
      query: activeTab === 'meal' ? searchQuery : '',
      ingredients: activeTab === 'ingredient' ? searchIngredients.join(',') : '',
      excludeIngredients: exclude,
      cuisines: filters.cuisines,
      minCalories: filters.minCalories !== '' ? Number(filters.minCalories) : undefined,
      maxCalories: filters.maxCalories !== '' ? Number(filters.maxCalories) : undefined,
      offset: currentOffset,
      number: PAGE_SIZE,
    };
  }

  async function handleSearch(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setHasSearched(true);
    setOffset(0);
    try {
      const searchQuery = query.trim();
      const searchIngredients = ingredientInputs.map(i => i.trim()).filter(Boolean);
      const data = await searchRecipes(buildParams(0, searchQuery, searchIngredients));
      setRecipes(data.results ?? []);
      setTotalResults(data.totalResults ?? 0);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setRecipes([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      const data = await searchRecipes(buildParams(
        nextOffset,
        query.trim(),
        ingredientInputs.map(i => i.trim()).filter(Boolean)
      ));
      setRecipes(prev => [...prev, ...(data.results ?? [])]);
      setOffset(nextOffset);
    } catch (err) {
      setError(err.message || 'Failed to load more recipes.');
    } finally {
      setLoadingMore(false);
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setRecipes([]);
    setTotalResults(0);
    setHasSearched(false);
    setError('');
    setOffset(0);
  }

  const hasMore = recipes.length < totalResults;

  return (
    <div className="container page-content">
      <section className="hero-section">
        <div className="hero-overlay">
          <h1>Discover Recipes From Around the World</h1>
          <p>Search by name or ingredient, filter by cuisine and calories</p>
        </div>
      </section>

      <section className="search-section">
        <p className="search-lead">Search by meal name or ingredient and discover new dishes.</p>
        <SearchTabs activeTab={activeTab} onChangeTab={handleTabChange} />
        <SearchForm
          activeTab={activeTab}
          query={query}
          onQueryChange={setQuery}
          ingredients={ingredientInputs}
          onIngredientChange={(i, val) =>
            setIngredientInputs(prev => prev.map((v, idx) => idx === i ? val : v))
          }
          onAddIngredient={() => setIngredientInputs(prev => [...prev, ''])}
          onRemoveIngredient={i =>
            setIngredientInputs(prev => prev.filter((_, idx) => idx !== i))
          }
          onSearch={handleSearch}
        />
      </section>

      <FilterPanel filters={filters} onChange={setFilters} onApply={handleSearch} />

      <section className="results-section" aria-live="polite">
        {loading && <div className="spinner" role="status" aria-label="Loading…" />}
        {error && <p className="state-message error">{error}</p>}

        {!loading && hasSearched && !error && (
          <p className="results-count">
            {recipes.length === 0
              ? 'No recipes found. Try adjusting your search or filters.'
              : `${recipes.length} of ${totalResults} recipes`}
          </p>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <div className="results-grid">
              {recipes.map(recipe => (
                <MealCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {hasMore && (
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <span className="spinner-inline" /> : 'Load More'}
              </button>
            )}
          </>
        )}

        {!loading && hasSearched && recipes.length === 0 && !error && (
          <div className="empty-state">
            <span className="empty-state-icon">🍽</span>
            <h3>No recipes found</h3>
            <p>Try a different search term or adjust your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
