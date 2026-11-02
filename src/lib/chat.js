// Treści asystenta bez AI. Odpowiedzi pochodzą wyłącznie z treści strony (sekcje i FAQ).
import { SITE } from './site.js';

export const CHAT_GREETING =
  'Cześć! Jestem asystentem AI Kornela. Odpowiem na pytania o automatyzacje, ceny i współpracę, a jeśli zechcesz, przekażę Twój kontakt Kornelowi.';

export const CHAT_TOPICS = [
  {
    id: 'cena',
    label: 'Ile to kosztuje?',
    keywords: ['koszt', 'kosztuje', 'cena', 'cen', 'ile to', 'płac', 'drogo', 'budżet', 'zł', 'stawk', 'wycen'],
    answer: `Pierwsza rozmowa jest bezpłatna. Wdrożenia zaczynają się od ${SITE.priceFrom}, a pierwsze trzy firmy płacą od ${SITE.pilotPrice} w zamian za opinię. Dokładną cenę znasz, zanim cokolwiek zaczniemy. Jeśli rozwiązanie nie zadziała tak, jak ustaliliście, Kornel oddaje pieniądze.`,
  },
  {
    id: 'zakres',
    label: 'Co można zautomatyzować?',
    keywords: ['zautomatyz', 'automatyz', 'co możesz', 'co robisz', 'oferta', 'usług', 'sprzedaż', 'marketing', 'obsług', 'mail', 'crm', 'excel', 'formularz', 'raport', 'faktur'],
    answer:
      'Najczęściej trzy obszary: sprzedaż (każde zapytanie w jednym miejscu i szybka odpowiedź z linkiem do kalendarza), marketing (prośby o opinię, przypomnienia o kolejnej usłudze) i obsługę klienta (AI odpowiada na powtarzalne pytania, trudne sprawy trafiają do Ciebie).',
  },
  {
    id: 'wspolpraca',
    label: 'Jak wygląda współpraca?',
    keywords: ['współprac', 'jak wygląda', 'krok', 'proces', 'zacząć', 'zaczyna', 'etap', 'plan'],
    answer:
      'Trzy kroki: 30-minutowa rozmowa o tym, co Cię spowalnia, potem krótki plan z wyceną i czasem, a na koniec wdrożenie na Twoich danych i szkolenie zespołu. Decydujesz po planie, bez presji.',
  },
  {
    id: 'technologia',
    label: 'Czy muszę znać się na technologii?',
    keywords: ['technolog', 'znać się', 'umiem', 'trudne', 'programow', 'kod', 'szkoleni', 'obsługiwać'],
    answer:
      'Nie. Ty znasz swoją firmę i klientów, Kornel zajmuje się techniką. Wszystko jest tłumaczone po ludzku, a po wdrożeniu zespół dostaje pokaz, jak z tego korzystać.',
  },
];

// Tematy bez przycisku: asystent rozpoznaje je tylko po słowach w pytaniu.
export const CHAT_EXTRA_TOPICS = [
  {
    id: 'czas',
    keywords: ['ile trwa', 'jak długo', 'czas', 'termin', 'szybko', 'kiedy', 'tydzień', 'tygodni', 'miesiąc'],
    answer:
      'Prosta automatyzacja, na przykład odpowiedź na zapytania z formularza, to zwykle tydzień. Większe wdrożenia trwają do miesiąca. Dokładny termin ustalacie w planie, przed startem.',
  },
  {
    id: 'dane',
    keywords: ['dane', 'danych', 'rodo', 'bezpiecz', 'prywatn', 'poufn'],
    answer:
      'Dane zostają w narzędziach, z których korzystasz, albo w takich, które wybierzecie razem. Kornel korzysta tylko z usług zgodnych z RODO i niczego nie udostępnia dalej.',
  },
  {
    id: 'mala-firma',
    keywords: ['mała firma', 'małej firmy', 'mała', 'za mał', 'jednoosob', 'sam prowadzę', 'kilka osób'],
    answer:
      'To najlepiej sprawdzić na rozmowie. Często właśnie w firmach od 5 do 20 osób jedna automatyzacja oszczędza najwięcej, bo każdy robi tam kilka rzeczy naraz.',
  },
  {
    id: 'ai-pomysly',
    keywords: ['pomysł', 'pomysły', 'demo', 'oferta od ai', 'gotowa oferta'],
    answer:
      'Po wysłaniu formularza dostajesz mail z linkiem do kalendarza i zapowiedzią 2-3 pomysłów przygotowanych przez AI na podstawie Twojego opisu. To szkic, nie gotowa oferta: szczegóły Kornel pokazuje na rozmowie.',
  },
];

// Prośby o kontakt: zamiast odpowiedzi pokazujemy blankiet zgłoszenia.
const CONTACT_KEYWORDS = ['porozmawia', 'rozmow', 'kontakt', 'zadzwo', 'spotka', 'umówić', 'umów', 'termin rozmowy', 'kalendarz'];

const normalize = (text) => ` ${String(text).toLowerCase().replace(/\s+/g, ' ')} `;

// Dopasowuje pytanie do tematu po słowach kluczowych. Zwraca 'kontakt', temat albo null.
export function matchTopic(text) {
  const q = normalize(text);
  if (CONTACT_KEYWORDS.some((k) => q.includes(k))) return { id: 'kontakt' };
  let best = null;
  let bestScore = 0;
  for (const topic of [...CHAT_TOPICS, ...CHAT_EXTRA_TOPICS]) {
    const score = topic.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

export const CHAT_PREVIEW_FALLBACK =
  'Na to pytanie nie mam gotowej odpowiedzi. Najlepiej zapytać Kornela bezpośrednio: zostaw kontakt, a odezwie się z linkiem do kalendarza. Możesz też wybrać jedno z pytań poniżej.';

// Krótkie podsumowanie rozmowy do pola „Co chcesz usprawnić?” w zgłoszeniu.
export function summarizeChat(userMessages, maxLength = 1500) {
  const lines = userMessages.map((m) => m.trim()).filter(Boolean);
  const text = lines.length
    ? `Kontakt z asystenta na stronie. Pytania w rozmowie: ${lines.join(' | ')}`
    : 'Kontakt z asystenta na stronie (bez dodatkowych pytań).';
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
