function SearchTabs({ activeTab, onChangeTab }) {
  return (
    <div className="tabs" role="tablist" aria-label="Recipe search mode">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'meal'}
        className={activeTab === 'meal' ? 'tab active' : 'tab'}
        onClick={() => onChangeTab('meal')}
      >
        Search by Meal Name
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'ingredient'}
        className={activeTab === 'ingredient' ? 'tab active' : 'tab'}
        onClick={() => onChangeTab('ingredient')}
      >
        Search by Ingredient
      </button>
    </div>
  );
}

export default SearchTabs;