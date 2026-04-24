import { useState } from 'react';
import { CUISINES } from '../api/spoonacular';

function FilterPanel({ filters, onChange, onApply }) {
  const [open, setOpen] = useState(false);

  const { minCalories, maxCalories, excludeIngredients, cuisines } = filters;

  function updateExclude(index, value) {
    const next = [...excludeIngredients];
    next[index] = value;
    onChange({ ...filters, excludeIngredients: next });
  }

  function addExclude() {
    onChange({ ...filters, excludeIngredients: [...excludeIngredients, ''] });
  }

  function removeExclude(index) {
    onChange({ ...filters, excludeIngredients: excludeIngredients.filter((_, i) => i !== index) });
  }

  function toggleCuisine(cuisine) {
    const next = cuisines.includes(cuisine)
      ? cuisines.filter(c => c !== cuisine)
      : [...cuisines, cuisine];
    onChange({ ...filters, cuisines: next });
  }

  function clearAll() {
    onChange({ minCalories: '', maxCalories: '', excludeIngredients: [''], cuisines: [] });
  }

  const activeCount = [
    minCalories !== '',
    maxCalories !== '',
    excludeIngredients.some(v => v.trim() !== ''),
    cuisines.length > 0,
  ].filter(Boolean).length;

  function handleApply() {
    onApply();
    setOpen(false);
  }

  return (
    <div className="filter-panel">
      <button
        type="button"
        className="filter-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="filter-toggle-left">
          <span>⚙ Filters</span>
          {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="filter-body">
          {/* Calories */}
          <div>
            <p className="filter-section-label">Calories</p>
            <div className="calorie-inputs">
              <input
                type="number"
                min={0}
                placeholder="Min"
                value={minCalories}
                onChange={e => onChange({ ...filters, minCalories: e.target.value })}
              />
              <span>–</span>
              <input
                type="number"
                min={0}
                placeholder="Max"
                value={maxCalories}
                onChange={e => onChange({ ...filters, maxCalories: e.target.value })}
              />
            </div>
          </div>

          {/* Exclude ingredients */}
          <div>
            <p className="filter-section-label">Exclude Ingredients</p>
            <div className="ingredient-inputs">
              {excludeIngredients.map((val, i) => (
                <div key={i} className="ingredient-row">
                  <input
                    type="text"
                    className="search-input"
                    placeholder={`e.g. ${['peanuts', 'shellfish', 'dairy'][i] ?? 'ingredient'}`}
                    value={val}
                    onChange={e => updateExclude(i, e.target.value)}
                  />
                  {excludeIngredients.length > 1 && (
                    <button
                      type="button"
                      className="remove-ingredient-button"
                      onClick={() => removeExclude(i)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-ingredient-button"
              style={{ marginTop: 8 }}
              onClick={addExclude}
            >
              + Add
            </button>
          </div>

          {/* Cuisines */}
          <div>
            <p className="filter-section-label">Cuisine</p>
            <div className="cuisine-grid">
              {CUISINES.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`cuisine-chip${cuisines.includes(c) ? ' selected' : ''}`}
                  onClick={() => toggleCuisine(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="filter-actions">
            <button type="button" className="filter-apply-btn" onClick={handleApply}>
              Apply Filters
            </button>
            <button type="button" className="filter-clear-btn" onClick={clearAll}>
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
