import { useLanguage } from '../context/LanguageContext';

function SearchTabs({ activeTab, onChangeTab }) {
  const { t } = useLanguage();
  return (
    <div className="tabs" role="tablist" aria-label="Recipe search mode">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'meal'}
        className={activeTab === 'meal' ? 'tab active' : 'tab'}
        onClick={() => onChangeTab('meal')}
      >
        {t.search.byMealName}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'ingredient'}
        className={activeTab === 'ingredient' ? 'tab active' : 'tab'}
        onClick={() => onChangeTab('ingredient')}
      >
        {t.search.byIngredient}
      </button>
    </div>
  );
}

export default SearchTabs;
