// Logika formularza bez przeglądarki: walidacja, wykrywanie botów, dane dla Make.
// Trzymamy ją osobno, żeby dało się ją sprawdzić testami (npm test).

export const COMPANY_SIZES = ['1-4', '5-20', '21-50', 'ponad 50'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

// Zwraca obiekt { pole: 'komunikat' }. Pusty obiekt = wszystko w porządku.
export function validate(data) {
  const errors = {};
  const name = clean(data.name);
  const email = clean(data.email);
  const company = clean(data.company);
  const message = clean(data.message);

  if (name.length < 2) errors.name = 'Podaj swoje imię.';
  if (!email) errors.email = 'Podaj adres e-mail.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Ten adres e-mail wygląda na niepełny.';
  if (!company) errors.company = 'Podaj nazwę firmy.';
  if (!COMPANY_SIZES.includes(data.size)) errors.size = 'Wybierz wielkość firmy.';
  if (message.length < 10) errors.message = 'Napisz w kilku słowach, co chcesz usprawnić.';
  if (data.consent !== true) errors.consent = 'Bez tej zgody nie mogę odpowiedzieć na zgłoszenie.';

  return errors;
}

// Pole-pułapka jest ukryte przed ludźmi. Jeśli ktoś je wypełnił, to bot.
export function isBot(data) {
  return clean(data.website) !== '';
}

// Dokładnie to trafia do webhooka Make (JSON).
export function buildPayload(data, now = new Date()) {
  return {
    name: clean(data.name),
    email: clean(data.email).toLowerCase(),
    company: clean(data.company),
    size: data.size,
    message: clean(data.message),
    consent: data.consent === true,
    honeypot: clean(data.website),
    source: 'strona-formularz',
    submitted_at: now.toISOString(),
  };
}
