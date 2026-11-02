import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLlmsTxt } from '../src/pages/llms.txt.js';

test('llms.txt: nagłówek, opis, kontakt i linki; bez nieustalonej kwoty', () => {
  const txt = buildLlmsTxt('https://strona.pl');
  assert.ok(txt.startsWith('# Kornel Dybalski'));
  assert.ok(txt.includes('\n> '));
  assert.ok(txt.includes('https://strona.pl/#kontakt'));
  assert.ok(txt.includes('korneldybalski@gmail.com'));
  assert.ok(txt.includes('Kornel rozwijał CRM'));
  assert.ok(!txt.includes('X zł'));
  assert.ok(!txt.includes('—'), 'bez długich myślników');
});
