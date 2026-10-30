# Design: „Paragon”

Strona jest przejrzystym rachunkiem. Każda obietnica to pozycja z czasem albo ceną, a dowodem jest paragon, który drukuje się na oczach odwiedzającego.

## Kolory (src/styles/global.css, @theme)

| Token | Wartość | Rola |
|---|---|---|
| cobalt | #1e2cc0 | pola na całą szerokość: nagłówek, dowód, formularz, pasek menu |
| cobalt-deep | #121c86 | stopka, krawędź przycisków na kobalcie |
| cobalt-soft | #cdd1fa | drugorzędny tekst na kobalcie (nigdy szary) |
| paper | #f3f3ee | tło strony i papier termiczny paragonów |
| paper-shade | #e4e4dc | sekcje przerywnikowe (usługi, FAQ) |
| ink / ink-soft | #10132b / #484d68 | druk i tekst drugorzędny na papierze |
| rule | #c9c9c0 | kropkowane linie prowadzące |
| stamp | #b8360e | jedyny akcent: pieczątki, numery pozycji, zaznaczenie tekstu, obrys fokusu. Tylko na papierze. |

Strategia: Committed. Kobalt niesie 40-50% powierzchni, papier resztę, pomarańcz występuje wyłącznie jako tusz pieczątki.

## Typografia

- Bricolage Grotesque (wdth 90, waga 700, tracking -0.03em): nagłówki, przycisk w kuponie, pieczątki.
- Onest: tekst ciągły, 17px, interlinia 1.6.
- JetBrains Mono: tylko dane na paragonach (czasy, ceny, pozycje) i etykiety pól formularza, cyfry tabelaryczne.
- Bez etykiet nad nagłówkami. Nagłówek sekcji: `.h-section` (clamp 2.25-4rem, max 18ch).

## Komponenty

- `.receipt` + `.receipt-shadow`: papier z ząbkowaną dolną krawędzią (maska), cień na wrapperze. Wiersze `.row` z `.lead` (kropki), separatory `.rule` i `.rule-double`.
- `.stamp`: obrys 3px w kolorze stamp, obrót -7°, wersaliki Bricolage. Na zdjęciu zawsze z tłem papieru (bez multiply).
- `.btn` / `.btn-paper`: klawisz kasy, twarda krawędź 3px pod spodem i miękki cień; wciska się przy kliknięciu.
- Kupon (Proof): papier z wyciętą perforacją po bokach i przerywaną ramką.
- Formularz to blankiet zgłoszenia na papierze; po wysłaniu zamienia się w paragon z licznikiem „Czekasz”.
- Kalkulator (sekcja na kobalcie): suwaki z pomarańczowym uchwytem w papierowej obwódce, paragon z wynikiem; na telefonie przyklejony pasek z wynikiem nad suwakami. Logika w `src/lib/calc.js` z testami.
- Personalizacja w nagłówku: pole „Sprawdź na swojej firmie” drukuje paragon z nazwą firmy odwiedzającego i wpisuje ją do formularza.
- `.tear-t` / `.tear-b`: postrzępiona krawędź papieru na styku kobaltowych sekcji (ząbki w kolorze sekcji).
- Bileciki przepływu w „Co robię”: po najechaniu zapalają się po kolei (pomarańcz), pokazując kroki automatu.
- Taśma z kasy pod nagłówkiem (Ticker): przesuwa się, zatrzymuje pod kursorem, przy ograniczonym ruchu stoi.

## Ruch

- Jeden autorski moment: druk paragonu w nagłówku (papier wysuwa się skokowo, steps(12), linie pojawiają się po kolei, licznik dobiega do 00:42, pieczątka uderza). Przycisk „Wydrukuj jeszcze raz”.
- Drugorzędne: paragon we „Współpracy” drukuje się w miarę przewijania (animation-timeline: view(), tylko tam, gdzie przeglądarka to obsługuje), wiersze usług zalewają się kobaltem pod kursorem (clip-path), paragony grozy prostują się przy najechaniu, pieczątka w „O mnie” uderza przy wejściu w kadr, plus FAQ obraca się w krzyżyk.
- Bez JS i przy prefers-reduced-motion wszystko jest widoczne od razu.

## Powierzchnie przeglądarki

Zaznaczenie tekstu: pomarańcz na papierze. Kursor: kobalt. Pasek przewijania: kobalt na papierze. Fokus: obrys 3px w kolorze stamp.

## Zasady

- Liczby na paragonach w nagłówku i w „paragonach grozy” to przykłady, oznaczone jako takie. Nie dodawać wymyślonych wyników klientów.
- Unikać: szarego tekstu na kobalcie, kart z cieniem jako struktury strony, etykiet nad nagłówkami, pomarańczu na kobalcie.
