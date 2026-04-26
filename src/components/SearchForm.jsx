import { useState, useRef } from 'react';
import { autocompleteIngredients } from '../api/spoonacular';

function IngredientInput({ index, value, total, onChange, onRemove }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  function handleChange(e) {
    const val = e.target.value;
    onChange(index, val);
    clearTimeout(timerRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      const results = await autocompleteIngredients(val.trim());
      setSuggestions(results);
      setOpen(results.length > 0);
    }, 300);
  }

  function handleSelect(name) {
    onChange(index, name);
    setSuggestions([]);
    setOpen(false);
  }

  function handleBlur() {
    setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="ingredient-row">
      <div className="autocomplete-wrapper">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. chicken, tomato, garlic…"
          aria-label={`Ingredient ${index + 1}`}
          className="search-input"
          autoComplete="off"
        />
        {open && (
          <ul className="autocomplete-dropdown" role="listbox">
            {suggestions.map(s => (
              <li key={s.id} onMouseDown={() => handleSelect(s.name)} role="option">
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {total > 1 && (
        <button
          type="button"
          className="remove-ingredient-button"
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      )}
    </div>
  );
}

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
  if (activeTab === 'ingredient') {
    return (
      <form className="search-form ingredient-form" onSubmit={onSearch}>
        <div className="ingredient-inputs">
          {ingredients.map((ingredient, index) => (
            <IngredientInput
              key={index}
              index={index}
              value={ingredient}
              total={ingredients.length}
              onChange={onIngredientChange}
              onRemove={onRemoveIngredient}
            />
          ))}
        </div>
        <div className="ingredient-actions">
          <button type="button" className="add-ingredient-button" onClick={onAddIngredient}>
            + Add Ingredient
          </button>
          <button type="submit" className="search-button">Search</button>
        </div>
      </form>
    );
  }

  return (
    <form className="search-form" onSubmit={onSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search recipes (e.g. pasta, butter chicken, tacos…)"
        aria-label="Search recipes"
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

export default SearchForm;
