# Kornel Dybalski, AI consulting

Strona osobista z formularzem, który przez Make trafia do HubSpot. Plan i decyzje: [PLAN.md](PLAN.md).

## Uruchomienie na komputerze

```bash
npm install
cp .env.example .env   # wklej adres webhooka z Make
npm run dev            # strona pod http://localhost:4321
npm test               # testy walidacji formularza
npm run build          # gotowa strona w folderze dist/
```

## Struktura

- `src/pages/index.astro` strona główna (8 sekcji)
- `src/pages/polityka-prywatnosci.astro`
- `src/components/` jedna sekcja = jeden komponent, formularz w `ContactForm.astro`
- `src/lib/form.js` walidacja i dane wysyłane do Make, `src/lib/site.js` e-mail, cena, link do LinkedIn
- `src/content/tutoriale/` miejsce na tutoriale (później)
- `public/` zdjęcie i ikony

## Netlify

Build: `npm run build`, folder: `dist` (ustawione w `netlify.toml`).
W Site configuration > Environment variables dodaj `PUBLIC_MAKE_WEBHOOK_URL`, potem zrób nowy deploy.
