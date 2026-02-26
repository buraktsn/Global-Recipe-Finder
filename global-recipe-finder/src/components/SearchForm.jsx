function SearchForm({
  activeTab,
  query,
  onQueryChange,
  ingredients,
  onIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
  onSearch,
}) {
  const mealPlaceholder = 'Type a meal name (e.g. Arrabiata)';

  if (activeTab === 'ingredient') {
    return (
      <form className="search-form ingredient-form" onSubmit={onSearch}>
        <div className="ingredient-inputs">
          {ingredients.map((ingredient, index) => (
            <div key={`ingredient-${index + 1}`} className="ingredient-row">
              <input
                type="text"
                value={ingredient}
                onChange={(event) => onIngredientChange(index, event.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                aria-label={`Ingredient ${index + 1}`}
                className="search-input"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="remove-ingredient-button"
                  onClick={() => onRemoveIngredient(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="ingredient-actions">
          <button type="button" className="add-ingredient-button" onClick={onAddIngredient}>
            + Add Ingredient
          </button>
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="search-form" onSubmit={onSearch}>
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={mealPlaceholder}
        aria-label={mealPlaceholder}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchForm;