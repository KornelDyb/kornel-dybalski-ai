# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Właściciele małych firm usługowych (5-50 osób) w Polsce: biura rachunkowe, gabinety, agencje, firmy remontowe i podobne. Trafiają na stronę z LinkedIn lub polecenia, zwykle na telefonie, między jednym klientem a drugim. Ich zadanie: zdecydować w kilka minut, czy warto oddać 30 minut na rozmowę z kimś o automatyzacji.

## Product Purpose
Osobista strona Kornela Dybalskiego, AI consulting. Jeden cel: umówienie bezpłatnej rozmowy przez formularz. Sukces: formularz przechodzi cały przepływ bez ręcznej pracy (Make → HubSpot → mail z linkiem do kalendarza w mniej niż 2 minuty) i przynosi pierwsze rozmowy.

## Positioning
Strona sama jest dowodem: formularz to działająca automatyzacja, klient dostaje odpowiedź w minutę. Kornel zna sprzedaż od strony CRM (rozwijał CRM dla 200-300 handlowców), nie sprzedaje narzędzi, tylko odzyskany czas.

## Operating Context
Przepływ leada: formularz → webhook Make → filtr pola-pułapki → HubSpot (kontakt + transakcja „Nowy lead”) → mail z Gmaila z linkiem do strony rezerwacji Google Calendar → powiadomienie dla Kornela. Etap 2: AI ocenia leada (gorący, ciepły, zimny).

## Capabilities and Constraints
Astro + Tailwind CSS, hosting Cloudflare Pages (adres testowy *.pages.dev, potem własna domena), formularz przez funkcję /api/lead, adres webhooka w sekrecie MAKE_WEBHOOK_URL. Jedna strona z 8 sekcjami (nagłówek, problem, co robię, współpraca, dowód, o mnie, FAQ, formularz) plus polityka prywatności. Teksty po polsku, krótko, po ludzku, bez em dash i bez fraz typowych dla AI. Musi działać na telefonie. Ceny jako „od X zł”, kwota nieustalona. Gwarancja zwrotu pieniędzy. Pierwsze 3 wdrożenia taniej w zamian za opinię.

## Brand Commitments
Marka to imię i nazwisko. Charakter „Konsultant”: spokój, zaufanie, klasa; doradca, któremu można powierzyć procesy. Kolory planu (granat + ciepły akcent) nie są wiążące: użytkownik zgodził się na zmianę, jeśli kierunek tego wymaga. Strona ma być wyraźnie żywa (interakcje, ruch), nie statyczna. Unikamy: wyglądu szablonu, gradientów fiolet-niebieski, ikon emoji, kart z cieniem wszędzie.

## Evidence on Hand
Zdjęcie: public/profile.webp (540x575). Fakt: CRM dla 200-300 handlowców (Respect Energy). LinkedIn: https://www.linkedin.com/in/kornel-dybalski-0342a8196/. Brak opinii klientów, case studies i liczb z wdrożeń: nie wolno ich wymyślać. Demo przepływu można pokazać jako ilustrację mechanizmu, oznaczoną jako przykład.

## Product Principles
- Pokaż, nie opowiadaj: szybkość odpowiedzi ma być widoczna na stronie.
- Jedna akcja: każda sekcja prowadzi do rozmowy.
- Po ludzku: zero żargonu, właściciel firmy nie musi znać technologii.
- Uczciwie: żadnych wymyślonych liczb, klientów ani opinii.
