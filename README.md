# Kornel Dybalski, AI consulting

Strona osobista z formularzem, który w kilka sekund zamienia zgłoszenie w kontakt w HubSpot i maila z linkiem do kalendarza. Plan i decyzje: [PLAN.md](PLAN.md), wygląd: [DESIGN.md](DESIGN.md).

Adres testowy: https://kornel-dybalski.korneldybalski.workers.dev

## Co robi strona (stan MVP)

**Strona (Astro + Tailwind, kierunek wizualny „Paragon”)**
- Nagłówek z drukującym się na żywo paragonem: przebieg jednego zgłoszenia od 00:00 do odpowiedzi w 00:42 (przykład) i pieczątka „Odpowiedź w 42 s”.
- „Sprawdź na swojej firmie”: odwiedzający wpisuje nazwę firmy, paragon drukuje się dla niego, a nazwa trafia do formularza.
- Taśma z kasy z korzyściami, „paragony grozy” (trzy typowe problemy), kalkulator „A ile to kosztuje Ciebie?” (godziny i złotówki z danych odwiedzającego), Co robię (z bilecikami przepływu), Współpraca jako rachunek z pozycjami, kupon dla pierwszych 3 firm, O mnie, FAQ, formularz.
- Polityka prywatności, strona 404, klauzula RODO pod formularzem, brak cookies.
- SEO: sitemap.xml, robots.txt, dane strukturalne, obrazek podglądu linku 1200×630. Lighthouse: wydajność 97, dostępność 100, dobre praktyki 100, SEO 100.

**Formularz i automatyzacja**
1. Formularz (walidacja w przeglądarce, pole-pułapka na boty) wysyła JSON na `/api/lead`.
2. Worker na Cloudflare (`worker/index.js`) sprawdza dane drugi raz, odsiewa boty i przekazuje je do webhooka Make. Adres webhooka jest tylko w sekrecie `MAKE_WEBHOOK_URL`.
3. Scenariusz w Make „Formularz strony → HubSpot + maile”: filtr na boty → kontakt w HubSpot (utwórz lub zaktualizuj) → mail do klienta z linkiem do Google Calendar (`docs/email-do-klienta.html`) → powiadomienie „Nowy lead” do Kornela. 4 operacje na zgłoszenie, w testach ok. 3 s od wysłania do maila.
4. Strona pokazuje paragon „Dzięki!” z czasem przyjęcia zgłoszenia.

**Bezpieczeństwo:** nagłówki CSP, HSTS, X-Frame-Options i inne (`public/_headers`), adresy testowe *.workers.dev z `noindex`.

**Nie działa jeszcze:** transakcje w HubSpot (brak uprawnienia `crm.objects.deals.write` w połączeniu Make), statystyki Umami (czekają na konto), limit zgłoszeń z jednego IP (reguła w Cloudflare po podpięciu domeny), własna domena.

## Uruchomienie na komputerze

```bash
npm install
cp .env.example .env   # wklej adres webhooka z Make
npm run dev            # strona pod http://localhost:4321 (bez funkcji /api/lead)
npm run build && npx wrangler dev   # strona razem z /api/lead (sekrety w pliku .dev.vars)
npm test               # testy: walidacja, kalkulator, obsługa formularza na serwerze
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
