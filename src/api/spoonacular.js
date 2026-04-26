const API_KEY = '8869bd28b74844be9e6c6a18f3b9923b';
const BASE_URL = 'https://api.spoonacular.com';

export const CUISINES = [
  'African',
  'American',
  'British',
  'Cajun',
  'Caribbean',
  'Chinese',
  'Eastern European',
  'European',
  'French',
  'German',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Japanese',
  'Jewish',
  'Korean',
  'Latin American',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Nordic',
  'Southern',
  'Spanish',
  'Thai',
  'Vietnamese',
  'Turkish',
];

export async function searchRecipes({
  query = '',
  ingredients = '',
  excludeIngredients = '',
  cuisines = [],
  minCalories,
  maxCalories,
  offset = 0,
  number = 12,
} = {}) {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    number,
    offset,
    addRecipeInformation: true,
    fillIngredients: true,
  });

  if (query) params.set('query', query);
  if (ingredients) params.set('includeIngredients', ingredients);
  if (excludeIngredients) params.set('excludeIngredients', excludeIngredients);
  if (cuisines.length > 0) params.set('cuisine', cuisines.join(','));
  if (minCalories != null) params.set('minCalories', minCalories);
  if (maxCalories != null) params.set('maxCalories', maxCalories);

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`);
  if (!res.ok) throw new Error(`Spoonacular error: ${res.status}`);
  return res.json();
}

export async function autocompleteIngredients(query, number = 5) {
  const params = new URLSearchParams({ apiKey: API_KEY, query, number });
  try {
    const res = await fetch(`${BASE_URL}/food/ingredients/autocomplete?${params}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function autocompleteIngredient(query) {
  const params = new URLSearchParams({ apiKey: API_KEY, query, number: 5 });
  const res = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?${params}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getRecipeById(id) {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    includeNutrition: true,
  });

  const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
  if (!res.ok) throw new Error(`Spoonacular error: ${res.status}`);
  return res.json();
}
