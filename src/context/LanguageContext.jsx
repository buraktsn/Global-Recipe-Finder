import { createContext, useContext, useState } from 'react';
import translations from '../i18n/translations';

const STORAGE_KEY = 'grf_lang';

function loadLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'tr' ? 'tr' : 'en';
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadLang);

  function toggle() {
    setLang(prev => {
      const next = prev === 'en' ? 'tr' : 'en';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
