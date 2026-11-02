# PRD: Strona Kornel Dybalski, AI consulting

Oct 30, 2026 · @Kornel

## Podsumowanie i cel

Osobista strona Kornela Dybalskiego o AI consultingu dla małych firm usługowych, z jednym celem: umówienie bezpłatnej rozmowy. Formularz na stronie jest jednocześnie pierwszym projektem do portfolio: zgłoszenie trafia przez Make do CRM, klient dostaje w minutę odpowiedź z linkiem do kalendarza, a Kornel powiadomienie. Później dochodzi sekcja tutoriali jako źródło ruchu i ocena leadów przez AI.

**Dla kogo:** właściciele małych firm usługowych (5-50 osób).

**Oferta:** AI consulting, czyli automatyzacje sprzedaży, marketingu i obsługi klienta. Pierwsze 3 wdrożenia w niższej cenie w zamian za opinię.

**Kryteria sukcesu (3 miesiące):**

- Strona działa pod własną domeną, formularz przechodzi cały przepływ bez ręcznej pracy.
- Odpowiedź do klienta przychodzi w mniej niż 2 minuty od wysłania formularza.
- Pierwsze umówione rozmowy z formularza.
- Projekt opisany jako case study na LinkedIn.

## Strona: sekcje i formularz

Jedna strona, jeden cel (przycisk „Umów bezpłatną rozmowę”), plus podstrona polityki prywatności.

| Sekcja | Zadanie | Treść |
| --- | --- | --- |
| 1. Nagłówek | Powiedzieć, co robię i dla kogo | „Pokażę Ci, co w Twojej firmie może robić AI”, podtytuł o automatyzacjach sprzedaży i obsługi klienta, przycisk CTA, zdjęcie |
| 2. Problem | Klient ma się rozpoznać | 3 sytuacje: odpowiedzi na zapytania po 2 dniach, klienci w Excelu, raporty zamiast sprzedaży |
| 3. Co robię | Pokazać zakres | Sprzedaż, marketing, obsługa klienta, każdy z jednym przykładem automatyzacji |
| 4. Współpraca | Zdjąć strach przed nieznanym | 3 kroki: rozmowa, plan, wdrożenie |
| 5. Dowód | Zastąpić brak opinii | „Wypełnij formularz i zobacz, jak szybko odpowiem”, oferta dla pierwszych 3 firm |
| 6. O mnie | Zbudować zaufanie | CRM od środka, budowanie zasięgów w internecie, teraz AI; zdjęcie |
| 7. FAQ | Odpowiedzieć na obawy | Cena, czas, „czy muszę znać się na technologii”, co dzieje się z danymi |
| 8. Formularz | Zebrać kontakt | Pola poniżej |

**Pola formularza:** imię, e-mail, nazwa firmy, wielkość firmy (lista: 1-4, 5-20, 21-50, ponad 50), „Co chcesz usprawnić?” (pole tekstowe), zgoda na przetwarzanie danych z linkiem do polityki prywatności (wymagana), ukryte pole-pułapka na boty.

**Po wysłaniu:** komunikat na stronie „Dzięki! Sprawdź skrzynkę, za chwilę dostaniesz link do wyboru terminu.” Przy błędzie: komunikat z prośbą o ponowienie i adresem e-mail do kontaktu.

## Przepływ leada

Cały przepływ dzieje się automatycznie, w mniej niż 2 minuty:

1. Klient wysyła formularz na stronie. Strona wysyła dane pod adres webhooka w Make.
2. Make odrzuca zgłoszenie, jeśli pole-pułapka jest wypełnione (bot).
3. Make zapisuje kontakt i transakcję w HubSpot (etap „Nowy lead”).
4. Make wysyła klientowi maila z Twojego Gmaila: krótko, po ludzku, z imieniem i linkiem do strony rezerwacji w Google Calendar.
5. Make wysyła Ci powiadomienie: kto, z jakiej firmy, co chce usprawnić.
6. Klient sam wybiera termin w kalendarzu, rozmowa ląduje w Twoim kalendarzu.

**Etap 2 (później):** między krokiem 2 a 3 AI ocenia leada (gorący, ciepły, zimny) na podstawie wielkości firmy i opisu, a ocena trafia do HubSpota i powiadomienia.

## Wygląd

Kierunek **Konsultant**: spokojny, budzący zaufanie, z klasą. Właściciel firmy ma poczuć, że rozmawia z doradcą, któremu może powierzyć procesy.

- **Kolory:** jasne, chłodne tło, głęboki granat jako kolor główny (przyciski, nagłówki), jeden ciepły akcent używany oszczędnie.
- **Typografia:** szeryfowe nagłówki (klasa, doradztwo), bezszeryfowy tekst (czytelność).
- **Zdjęcie:** Twoje zdjęcie w nagłówku i w sekcji „O mnie”.
- **Zasady:** dużo światła, krótkie akapity, jeden przycisk CTA powtarzany w kilku miejscach, działa na telefonie, tryb ciemny opcjonalnie.
- **Unikamy:** wyglądu szablonu, gradientów fiolet-niebieski, ikon emoji, kart z cieniem wszędzie.

## Technologia i koszty

Na start całość kosztuje 0 zł; domena dochodzi przed promocją strony.

| Element | Wybór | Dlaczego | Koszt |
| --- | --- | --- | --- |
| Strona | Astro + Tailwind CSS | szybka statyczna strona, tutoriale jako pliki Markdown | 0 zł |
| Kod | repozytorium GitHub | historia zmian, automatyczne wdrożenia | 0 zł |
| Hosting | Cloudflare Workers (pliki strony + funkcja formularza) | zmiana na GitHubie = nowa wersja strony, bez limitu transferu | 0 zł |
| Automatyzacja | Make, plan Free | 1000 kredytów/mies., ok. 150 zgłoszeń | 0 zł |
| CRM | HubSpot Free | kontakty i transakcje, gotowe moduły w Make | 0 zł |
| Terminy | Google Calendar, strona rezerwacji | klient sam wybiera godzinę | 0 zł |
| Maile | Gmail | odpowiedź od Ciebie, nie z no-reply | 0 zł |
| Domena | np. .pl | profesjonalny adres | ok. 50 zł/rok, później |

Źródło limitu Make: [Jetadmin, Make pricing](https://www.jetadmin.io/blog/make-pricing/).

## Ryzyka, założenia i decyzje

**Ryzyka i jak je ograniczamy:**

- Spam w formularzu (adres webhooka jest widoczny w kodzie) → pole-pułapka, walidacja maila, filtr w Make.
- Automatyczny mail brzmi jak robot → krótki tekst pisany Twoim językiem, bez sformułowań typowych dla AI.
- RODO → polityka prywatności na osobnej podstronie, zgoda wymagana w formularzu.
- Brak opinii → dowodem jest sama strona i oferta dla pierwszych 3 firm.
- Adres workers.dev → domena kupiona przed promocją.

**Założenia do sprawdzenia:**

- Administratorem danych na start jest Kornel jako osoba prywatna; forma działalności do ustalenia przed pierwszą fakturą (do konsultacji z księgowym lub prawnikiem).
- Darmowy plan Make uruchamia scenariusz z webhooka od razu; sprawdzić przy zadaniu 6.
- Ceny usług na stronie jako „od X zł”; kwoty do ustalenia przed publikacją.

| Decyzja | Dlaczego |
| --- | --- |
| AI consulting jako oferta | Wybór Kornela; nisza zawęzi się po pierwszych rozmowach |
| Cel strony: bezpłatna rozmowa | Kornel lubi rozmowy, w usługach B2B to one sprzedają |
| Marka: imię i nazwisko | Na start ludzie kupują od człowieka |
| Kierunek wizualny A, Konsultant | Wybór Kornela; zaufanie i spokój |
| Astro zamiast czystego HTML | Tutoriale jako pliki Markdown, wygląd przez skill projektowy |
| Make + HubSpot + Gmail + Google Calendar | Darmowe, popularne, gotowe połączenia |
| Ceny „od X zł”, gwarancja zwrotu | Odsiewa osoby bez budżetu, zdejmuje ryzyko z klienta |
| Hosting: Cloudflare Workers zamiast Netlify | Darmowy plan bez limitu transferu i z 500 wdrożeniami miesięcznie; na Netlify po wyczerpaniu 300 kredytów strona się wyłącza. Adres testowy workers.dev, potem własna domena. Workers zamiast Pages, bo tak prowadzi nowy kreator Cloudflare |
| Make na start, n8n później | Make jest darmowy; funkcja /api/lead wysyła zwykły JSON, więc zmiana to tylko nowy adres webhooka |

## Zadania MVP

- [x] 1\. Szkielet: projekt Astro (gotowe), repozytorium GitHub, pierwsza wersja na Cloudflare Workers (gotowe, gdy pod adresem workers.dev widać stronę).
- [x] 2\. Wygląd: kolory, czcionki, układ w kierunku Konsultant (gotowe, gdy nagłówek wygląda jak w szkicu A na telefonie i komputerze).
- [x] 3\. Treść sekcji 1-7 (gotowe, gdy wszystkie sekcje mają prawdziwy tekst i zdjęcie).
- [x] 4\. Formularz z walidacją i polem-pułapką, na razie bez wysyłki (gotowe, gdy puste pola i zły mail pokazują błąd).
- [x] 5\. Polityka prywatności i zgoda w formularzu (gotowe, gdy link działa, a bez zgody formularz się nie wysyła).
- [x] 6\. Make: webhook odbiera zgłoszenie (gotowe, gdy testowe zgłoszenie widać w historii Make).
- [ ] 7\. Make: zapis do HubSpot (gotowe, gdy kontakt i transakcja pojawiają się w CRM). Kontakt działa; transakcja czeka na uprawnienie crm.objects.deals.write w połączeniu Make–HubSpot.
- [x] 8\. Make: mail do klienta z linkiem do kalendarza i powiadomienie dla Ciebie (gotowe, gdy oba maile przychodzą w mniej niż 2 minuty).
- [x] 9\. Stany formularza: wysyłanie, sukces, błąd (gotowe, gdy każdy ma komunikat).
- [ ] 10\. Test całości z telefonu i komputera, 3 zgłoszenia testowe (gotowe, gdy przepływ działa bez ręcznej pracy).
- [ ] 11\. Domena i publikacja (później, przed promocją).
- [ ] 12\. Etap 2: AI ocenia leada w Make (później).

## Słowniczek

| Pojęcie | Po ludzku |
| --- | --- |
| CTA | Przycisk lub zachęta do jednej konkretnej akcji, tu „Umów bezpłatną rozmowę” |
| Lead | Osoba, która zostawiła kontakt i może zostać klientem |
| Usługa w pudełku | Usługa ze stałą nazwą, zakresem i ceną, sprzedawana jak produkt |
| Make | Narzędzie, które łączy aplikacje: „gdy przyjdzie X, zrób Y i Z” |
| Webhook | Adres, pod który strona wysyła dane z formularza, żeby Make je odebrał |
| Honeypot (pole-pułapka) | Pole niewidoczne dla ludzi; jeśli jest wypełnione, wysłał to bot |
| CRM | Lista klientów z historią kontaktu i etapem sprzedaży |
| Hosting | Komputer w internecie, na którym leży strona |
| Domena | Adres strony, np. kornel-dybalski.pl |
| Repozytorium | Folder z kodem na GitHubie, który pamięta każdą zmianę |
| Astro | Narzędzie, które z plików projektu robi gotową, szybką stronę |
| Administrator danych | Osoba lub firma odpowiedzialna za dane osobowe według RODO |
| Zmienna środowiskowa | Ustawienie trzymane poza kodem (plik .env lokalnie, ustawienia Cloudflare na serwerze), np. adres webhooka |
| Test automatyczny | Mały program, który sprawdza, czy kod działa; uruchamiasz go poleceniem npm test |
| Commit | Zapisany punkt w historii projektu z opisem, co się zmieniło |
| JSON | Prosty format danych, w którym strona wysyła zgłoszenie do Make |
| Payload | Paczka danych wysyłana w jednym zgłoszeniu |
| Funkcja serwerowa (Worker) | Mały program na serwerze Cloudflare, który odbiera formularz, zanim dane pójdą dalej |
| Rate limit | Limit zgłoszeń z jednego adresu w danym czasie, chroni przed zasypaniem spamem |
| Nagłówki bezpieczeństwa | Instrukcje dla przeglądarki, co strona może wczytywać i czy można ją osadzać na innych stronach |
| Open Graph (og:image) | Obrazek i opis, które pokazują się przy udostępnieniu linku na LinkedIn czy Facebooku |
| Dane strukturalne (JSON-LD) | Opis strony w języku zrozumiałym dla Google: kto, co oferuje, gdzie |

## Stan prac i ustalenia z budowy

**Zrobione w kodzie:** zadania 2, 3, 4, 5 i 9 oraz projekt Astro z zadania 1. Brakuje repozytorium na GitHubie i podpięcia Cloudflare (wymaga Twojego konta).

**Zmiana z budowy:** formularz nie wysyła danych prosto do Make. Wysyła je do Workera na Cloudflare (`/api/lead`, plik `worker/index.js`), która sprawdza je drugi raz, odsiewa boty i dopiero przekazuje do Make. Limit zgłoszeń z jednego IP dodamy regułą Rate limiting w Cloudflare po podpięciu własnej domeny (na adresie workers.dev takiej reguły nie da się ustawić). Adres webhooka jest w zmiennej `MAKE_WEBHOOK_URL` (tylko na serwerze, nie widać go w kodzie strony). Instrukcja konfiguracji Make: `docs/make-krok-po-kroku.md`.

**Narzędzie automatyzacji:** na start Make (darmowy plan). Możliwe przeniesienie do n8n, gdy przepływ będzie działał; funkcja `/api/lead` wysyła zwykły JSON, więc zmiana to tylko nowy adres w `MAKE_WEBHOOK_URL`.

**Dane, które formularz wysyła do Make (JSON):**

```json
{
  "name": "Anna",
  "email": "anna@firma.pl",
  "company": "Firma Sp. z o.o.",
  "size": "5-20",
  "message": "Chcę szybciej odpisywać na zapytania.",
  "consent": true,
  "honeypot": "",
  "source": "strona-formularz",
  "submitted_at": "2026-10-30T12:00:00.000Z"
}
```

Filtr w Make (krok 2 przepływu): przepuszczaj tylko zgłoszenia, w których `honeypot` jest pusty. Strona i tak nie wysyła zgłoszeń od botów, ale filtr chroni przed kimś, kto wyśle dane prosto na adres webhooka.

**Do uzupełnienia przed publikacją:**

- Kwota w FAQ: „od X zł”, zmienia się w `src/lib/site.js` (pole `priceFrom`).
- Czasy w sekcji Współpraca i FAQ (tydzień, 1 do 4 tygodni) to propozycja, popraw, jeśli pracujesz inaczej.
- Polityka prywatności napisana dla Kornela jako osoby prywatnej; do przejrzenia przez prawnika, gdy ustalisz formę działalności.
- Zdjęcie i link do LinkedIn wzięte z Twojej strony KornelDyb.github.io.
- Regulamin: szkic w `docs/regulamin-szkic.md`, do decyzji z prawnikiem (nieopublikowany).
- Statystyki: po założeniu konta w Umami Cloud ustaw `PUBLIC_UMAMI_WEBSITE_ID` w Cloudflare (Settings > Build > Build variables). Zdarzenia: cta-naglowek, personalizacja, kalkulator-uzyty, cta-kalkulator, cta-kupon, formularz-wyslany.
- Przy zmianie domeny: zmień `site` w `astro.config.mjs` i adres w `public/robots.txt`.

**Decyzje techniczne z budowy:**

- Czcionki Newsreader i Instrument Sans hostowane razem ze stroną (paczki Fontsource), a nie z Google Fonts: adres IP odwiedzających nie trafia do Google, więc polityka prywatności jest prostsza.
- Walidacja formularza w osobnym pliku `src/lib/form.js` z testami (`npm test`).

## Etap 13: stan budowy

- Zrobione: serwer `/api/demo` z testami, prompt z zasadami (bez cen, bez obietnic wyników, formy neutralne, treść zgłoszenia traktowana jako dane), mail z pomysłami w barwach strony, zmiany na stronie i w polityce prywatności.
- Dostawca AI: Claude przez API Anthropic (decyzja Kornela), domyślnie Claude Opus 5.5 z automatyczną rezerwą przy odmowie. OpenAI zostaje jako opcja (`AI_PROVIDER=openai`).
- Do zrobienia: sekrety w Cloudflare (ANTHROPIC_API_KEY, DEMO_SECRET), scenariusz w Make (wywołanie /api/demo po mailu z kalendarzem, wysyłka maila, limit 1 demo na adres na dobę), szablon Google Slides, 10 próbnych zgłoszeń.

## Prompt dla Claude Code

Przed startem: wyeksportuj ten dokument jako Markdown i zapisz w pustym folderze projektu jako `PLAN.md`. Potem otwórz ten folder w Claude Code i wklej:

```text
Budujemy moją stronę osobistą: Kornel Dybalski, AI consulting dla małych firm usługowych. Pełny plan jest w PLAN.md, przeczytaj go najpierw w całości.

Kontekst o mnie: uczę się, kod bywa dla mnie trudny. Przy każdym kroku wyjaśniaj prostym językiem, co robisz i dlaczego, a nowe pojęcia dopisuj do słowniczka w PLAN.md.

Stack: Astro + Tailwind CSS, repozytorium GitHub, hosting Netlify. Formularz wysyła dane (fetch, JSON) na adres webhooka Make zapisany w zmiennej środowiskowej PUBLIC_MAKE_WEBHOOK_URL, nigdy wpisany na sztywno w kod.

Struktura:
- src/pages/index.astro (strona główna, 8 sekcji z PLAN.md)
- src/pages/polityka-prywatnosci.astro
- src/components/ (jedna sekcja = jeden komponent, plus ContactForm)
- src/content/tutoriale/ (na później, kolekcja Markdown)
- public/ (zdjęcie, favicon)

Wygląd: kierunek Konsultant z PLAN.md. Przed pisaniem UI użyj skilla do projektowania frontendu (np. frontend-design), jeśli jest dostępny. Strona ma wyglądać na zaprojektowaną, nie jak szablon. Musi działać na telefonie.

Teksty: po polsku, krótko, po ludzku, bez myślników typu em dash i bez sformułowań typowych dla AI.

Zasady pracy:
- Użyj skilla feature-builder, jeśli jest dostępny: najpierw test lub kryterium sprawdzenia, potem kod, dalej tylko gdy działa.
- Małe commity, jeden na zadanie z listy w PLAN.md, z czytelnym opisem po polsku.
- Pytaj przed dużymi zmianami i przed instalacją nowych pakietów.
- Nie wpisuj żadnych kluczy ani adresów webhooka do kodu; używaj pliku .env i dodaj go do .gitignore.

Zasada konsultacji: gdy zadanie dotyka założenia do sprawdzenia albo pojawia się decyzja, której nie ma w PLAN.md, zatrzymaj się, wyjaśnij ją prostym językiem, daj 2-3 warianty z rekomendacją i zapisz mój wybór w PLAN.md.

Kroki w Make, HubSpot i Google Calendar wykonuję sam w przeglądarce. Przy zadaniach 6-8 prowadź mnie krok po kroku: co kliknąć i co wpisać.

Zacznij od zadania nr 1 z PLAN.md.
```
