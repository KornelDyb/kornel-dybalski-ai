# Kornel Dybalski, AI consulting

Strona osobista z formularzem, który przez Make trafia do HubSpot. Plan i decyzje: [PLAN.md](PLAN.md).

## Uruchomienie na komputerze

```bash
npm install
cp .env.example .env   # wklej adres webhooka z Make
npm run dev            # strona pod http://localhost:4321 (bez funkcji /api/lead)
npm run build && npx wrangler dev   # strona razem z /api/lead (sekrety w pliku .dev.vars)
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

## Cloudflare Workers

Projekt to Worker ze statycznymi plikami (`wrangler.jsonc`): pliki strony z `dist/`, a `/api/lead` obsługuje `worker/index.js`.
- W Cloudflare (Compute → Workers & Pages → kornel-dybalski → Settings → Build): build command `npm run build`, deploy command `npx wrangler deploy`.
- Settings → Variables and Secrets: `MAKE_WEBHOOK_URL` (Secret). `PUBLIC_UMAMI_WEBSITE_ID` jest potrzebne przy budowaniu, więc wpisz je w Settings → Build → Build variables.
- Każdy push na `main` wdraża nową wersję. Gałęzie dostają adresy podglądu (Preview builds).
- Adresy testowe `*.workers.dev` dostają nagłówek `noindex`, więc nie trafią do Google.

Logika formularza: `src/lib/lead-handler.js`. Konfiguracja Make: `docs/make-krok-po-kroku.md`.
Nagłówki bezpieczeństwa i cache: `public/_headers`.
