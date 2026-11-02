import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeChat, CHAT_TOPICS } from '../src/lib/chat.js';
import { validate } from '../src/lib/form.js';

test('podsumowanie rozmowy przechodzi walidację pola opisu', () => {
  const empty = summarizeChat([]);
  const withQuestions = summarizeChat(['Ile to kosztuje?', '  ', 'Czy działa z Excelem?']);
  for (const message of [empty, withQuestions]) {
    const errors = validate({ name: 'Anna', email: 'a@b.pl', company: 'Firma', size: '5-20', message, consent: true });
    assert.deepEqual(errors, {});
  }
  assert.ok(withQuestions.includes('Ile to kosztuje? | Czy działa z Excelem?'));
});

test('podsumowanie jest przycinane do limitu', () => {
  const long = summarizeChat(['x'.repeat(3000)], 200);
  assert.equal(long.length, 200);
  assert.ok(long.endsWith('…'));
});

test('każdy temat ma etykietę i odpowiedź', () => {
  for (const t of CHAT_TOPICS) assert.ok(t.id && t.label && t.answer.length > 40);
});
