import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lostTime } from '../src/lib/calc.js';

test('liczy godziny tygodniowo, miesięcznie, dni robocze i koszt', () => {
  // 30 zapytań po 10 minut = 5 h, plus 3 h raportów = 8 h tygodniowo
  const r = lostTime({ inquiries: 30, minutes: 10, reportHours: 3, rate: 100 });
  assert.equal(r.weekly, 8);
  assert.equal(Math.round(r.monthly * 10) / 10, 34.7); // 8 * 52 / 12
  assert.equal(Math.round(r.days * 10) / 10, 4.3); // przy 8 h dziennie
  assert.equal(Math.round(r.money), 3467);
});

test('zera dają zero, a ujemne lub puste wartości traktuje jak zero', () => {
  assert.deepEqual(lostTime({ inquiries: 0, minutes: 0, reportHours: 0, rate: 0 }), { weekly: 0, monthly: 0, days: 0, money: 0 });
  assert.equal(lostTime({ inquiries: -5, minutes: 10, reportHours: undefined, rate: 50 }).weekly, 0);
});
