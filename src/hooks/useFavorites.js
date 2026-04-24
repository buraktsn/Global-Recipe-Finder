import { useState, useEffect } from 'react';

const STORAGE_KEY = 'grf_favorites';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(recipe) {
    setFavorites(prev =>
      prev.some(r => r.id === recipe.id) ? prev : [...prev, recipe]
    );
  }

  function removeFavorite(id) {
    setFavorites(prev => prev.filter(r => r.id !== id));
  }

  function isFavorite(id) {
    return favorites.some(r => r.id === id);
  }

  function toggleFavorite(recipe) {
    isFavorite(recipe.id) ? removeFavorite(recipe.id) : addFavorite(recipe);
  }

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
