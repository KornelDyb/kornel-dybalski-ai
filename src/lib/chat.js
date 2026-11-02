// Treści asystenta w trybie podglądu (bez AI). Odpowiedzi pochodzą wyłącznie z treści strony.
import { SITE } from './site.js';

export const CHAT_GREETING =
  'Cześć! Jestem asystentem AI Kornela. Odpowiem na pytania o automatyzacje, ceny i współpracę, a jeśli zechcesz, przekażę Twój kontakt Kornelowi.';

export const CHAT_TOPICS = [
  {
    id: 'cena',
    label: 'Ile to kosztuje?',
    answer: `Pierwsza rozmowa jest bezpłatna. Wdrożenia zaczynają się od ${SITE.priceFrom}, a dokładną cenę znasz, zanim cokolwiek zaczniemy. Jeśli rozwiązanie nie zadziała tak, jak ustaliliście, Kornel oddaje pieniądze.`,
  },
  {
    id: 'zakres',
    label: 'Co można zautomatyzować?',
    answer:
      'Najczęściej trzy obszary: sprzedaż (każde zapytanie w jednym miejscu i szybka odpowiedź z linkiem do kalendarza), marketing (prośby o opinię, przypomnienia o kolejnej usłudze) i obsługę klienta (AI odpowiada na powtarzalne pytania, trudne sprawy trafiają do Ciebie).',
  },
  {
    id: 'wspolpraca',
    label: 'Jak wygląda współpraca?',
    answer:
      'Trzy kroki: 30-minutowa rozmowa o tym, co Cię spowalnia, potem krótki plan z wyceną i czasem, a na koniec wdrożenie na Twoich danych i szkolenie zespołu. Decydujesz po planie, bez presji.',
  },
  {
    id: 'technologia',
    label: 'Czy muszę znać się na technologii?',
    answer:
      'Nie. Ty znasz swoją firmę i klientów, Kornel zajmuje się techniką. Wszystko jest tłumaczone po ludzku, a po wdrożeniu zespół dostaje pokaz, jak z tego korzystać.',
  },
];

export const CHAT_PREVIEW_FALLBACK =
  'To wersja testowa asystenta: na razie odpowiadam na pytania z przycisków poniżej. Wkrótce odpowiem też na własne pytania. Możesz też od razu zostawić kontakt.';

// Krótkie podsumowanie rozmowy do pola „Co chcesz usprawnić?” w zgłoszeniu.
export function summarizeChat(userMessages, maxLength = 1500) {
  const lines = userMessages.map((m) => m.trim()).filter(Boolean);
  const text = lines.length
    ? `Kontakt z asystenta na stronie. Pytania w rozmowie: ${lines.join(' | ')}`
    : 'Kontakt z asystenta na stronie (bez dodatkowych pytań).';
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
