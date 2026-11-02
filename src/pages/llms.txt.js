// llms.txt: opis strony prostym tekstem dla asystentów AI (ChatGPT, Claude, Perplexity).
// Składany przy budowaniu z tych samych danych co strona, więc nie rozjeżdża się z treścią.
import { SITE } from '../lib/site.js';

// Dopóki kwota nie jest ustalona („X zł”), nie podajemy jej asystentom.
const priceKnown = !/X/.test(SITE.priceFrom);

export function buildLlmsTxt(site) {
  const url = (path) => new URL(path, site).href;
  return `# ${SITE.name}: ${SITE.role}

> ${SITE.name} wdraża automatyzacje i AI w małych firmach usługowych w Polsce (zwykle 5 do 50 osób): sprzedaż, marketing i obsługę klienta. Pierwsza 30-minutowa rozmowa online jest bezpłatna.

## Dla kogo

Właściciele małych firm usługowych, na przykład biur rachunkowych, gabinetów, agencji i firm remontowych, którzy tracą czas na ręczne odpisywanie na zapytania, przepisywanie danych i przypominanie klientom.

## Co robi

- Sprzedaż: każde zapytanie trafia do jednego miejsca (CRM), a klient od razu dostaje odpowiedź z linkiem do kalendarza.
- Marketing: prośby o opinię po usłudze i przypomnienia o kolejnej wizycie lub przeglądzie, wysyłane automatycznie.
- Obsługa klienta: AI odpowiada na powtarzalne pytania, a trudne sprawy i reklamacje trafiają do właściciela.
- Nie sprzedaje narzędzi. Wdraża rozwiązania na tym, czego firma już używa (np. Gmail, Kalendarz Google, arkusze, CRM, Make).

## Jak wygląda współpraca

1. Rozmowa: 30 minut, online, bezpłatnie, bez zobowiązań.
2. Plan: w kilka dni, co zautomatyzować, ile to kosztuje i ile czasu się odzyska.
3. Wdrożenie: od 1 do 4 tygodni, z testami na danych firmy i szkoleniem zespołu.

## Cena

${priceKnown ? `Wdrożenia od ${SITE.priceFrom}. ` : ''}Rozmowa jest bezpłatna. Dokładną cenę klient zna z planu, zanim cokolwiek się zacznie. Jeśli wdrożenie nie działa tak, jak ustalono, ${SITE.name} oddaje pieniądze. Pierwsze 3 wdrożenia są tańsze w zamian za opinię.

## Doświadczenie

${SITE.name.split(" ")[0]} rozwijał CRM dla działu sprzedaży, w którym pracowało od 200 do 300 handlowców, i sam budował zasięgi w internecie. Łączy doświadczenie ze sprzedaży i marketingu z AI.

## Jak się umówić

- Formularz na stronie: ${url('/#kontakt')} (odpowiedź z linkiem do kalendarza w około minutę)
- E-mail: ${SITE.email}
- LinkedIn: ${SITE.linkedin}

## Strony

- [Strona główna](${url('/')}): oferta, proces, FAQ i formularz kontaktu
- [Polityka prywatności](${url('/polityka-prywatnosci')}): jak przetwarzane są dane z formularza i czatu
`;
}

export function GET({ site }) {
  return new Response(buildLlmsTxt(site), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
