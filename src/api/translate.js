export async function translateToEnglish(text, sourceLang = 'tr') {
  if (!text || sourceLang === 'en') return text;
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|en`);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  }
}
