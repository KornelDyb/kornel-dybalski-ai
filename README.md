# Kornel Dybalski, AI consulting

Strona osobista z formularzem, który przez Make trafia do HubSpot. Plan i decyzje: [PLAN.md](PLAN.md).

## Uruchomienie na komputerze

```bash
npm install
cp .env.example .env   # wklej adres webhooka z Make
npm run dev            # strona pod http://localhost:4321 (bez funkcji /api/lead)
npm run build && npx wrangler pages dev dist   # strona razem z funkcją /api/lead (sekrety w .dev.vars)
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

## Cloudflare Pages

Workers & Pages → Create → Pages → Connect to Git → wybierz repozytorium.
- Framework preset: Astro, build command: `npm run build`, output: `dist` (Node 22 z pliku `.node-version`).
- Settings → Variables and Secrets: `MAKE_WEBHOOK_URL` (Secret), opcjonalnie `PUBLIC_UMAMI_WEBSITE_ID` (Text).
- Gałąź `main` to wersja główna pod `kornel-dybalski.pages.dev`; każda inna gałąź dostaje własny adres podglądu do testów.
- Adresy *.pages.dev mają nagłówek `noindex` (plik `public/_headers`), więc wersje testowe nie trafią do Google.

Funkcja formularza: `functions/api/lead.js` (logika w `src/lib/lead-handler.js`). Konfiguracja Make: `docs/make-krok-po-kroku.md`.
Nagłówki bezpieczeństwa i cache: `public/_headers`.
