# Global-Recipe-Finder
Global yemek tarif sitesi (sadece Türk mutfağı değil, dünya mutfakları)  Malzemeye göre tarif öner  Yemek adına göre tarif ara  Liste ekranında:  Yemek adı  Fotoğraf  Hangi ülke/yöre  Kısa açıklama  📄 Detay sayfasında:  Tüm malzemeler  Yapılışı  Kalori / kategori / mutfak tipi  Belki zorluk seviyesi  
# Global Recipe Finder

A modern React + Vite recipe search app that uses the [TheMealDB API](https://www.themealdb.com/api.php).

## Features

- Search by **meal name**
- Search by **ingredient**
- Clean card-based results with:
  - meal image
  - meal name
  - area (country)
  - short description
- Detail page with:
  - large image
  - meal name
  - area and category
  - ingredients list with measures
  - full instructions
  - YouTube link when available
- Loading, error, and no-results states

## Tech Stack

- React (functional components)
- Vite
- React Router
- Fetch API
- Plain CSS (no Tailwind)

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:4173`.