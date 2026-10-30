import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, isBot, buildPayload, COMPANY_SIZES } from '../src/lib/form.js';

const ok = {
  name: 'Anna',
  email: 'anna@firma.pl',
  company: 'Firma Sp. z o.o.',
  size: '5-20',
  message: 'Chcę szybciej odpisywać na zapytania.',
  consent: true,
  website: '',
};

test('poprawne dane nie dają błędów', () => {
  assert.deepEqual(validate(ok), {});
});

test('puste pola dają błąd przy każdym wymaganym polu', () => {
  const errors = validate({});
  for (const field of ['name', 'email', 'company', 'size', 'message', 'consent']) {
    assert.ok(errors[field], `brak błędu dla pola ${field}`);
  }
});

test('same spacje traktujemy jak puste pole', () => {
  assert.ok(validate({ ...ok, name: '   ' }).name);
});

test('zły e-mail daje błąd', () => {
  for (const email of ['anna', 'anna@', 'anna@firma', '@firma.pl', 'an na@firma.pl']) {
    assert.ok(validate({ ...ok, email }).email, email);
  }
});

test('wielkość firmy musi być z listy', () => {
  assert.deepEqual(COMPANY_SIZES, ['1-4', '5-20', '21-50', 'ponad 50']);
  assert.ok(validate({ ...ok, size: '1000' }).size);
});

test('bez zgody formularz się nie wysyła', () => {
  assert.ok(validate({ ...ok, consent: false }).consent);
});

test('wypełnione pole-pułapka oznacza bota', () => {
  assert.equal(isBot(ok), false);
  assert.equal(isBot({ ...ok, website: 'http://spam.example' }), true);
});

test('dane do Make są przycięte i mają źródło oraz datę', () => {
  const p = buildPayload({ ...ok, name: '  Anna ', email: ' Anna@Firma.pl ' }, new Date('2026-10-30T12:00:00Z'));
  assert.equal(p.name, 'Anna');
  assert.equal(p.email, 'anna@firma.pl');
  assert.equal(p.consent, true);
  assert.equal(p.honeypot, '');
  assert.equal(p.source, 'strona-formularz');
  assert.equal(p.submitted_at, '2026-10-30T12:00:00.000Z');
});
