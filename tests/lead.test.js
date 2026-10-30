import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleLead } from '../src/lib/lead-handler.js';

const good = {
  name: 'Anna', email: 'anna@firma.pl', company: 'Firma', size: '5-20',
  message: 'Chcę szybciej odpisywać klientom.', consent: true, website: '',
};
const post = (body, headers = {}) =>
  new Request('https://strona.pl/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const fakeFetch = (status = 200) => {
  const calls = [];
  const fn = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return new Response('Accepted', { status }); };
  fn.calls = calls;
  return fn;
};
const opts = (f) => ({ webhookUrl: 'https://hook.eu2.make.com/x', fetchImpl: f, now: new Date('2026-10-30T12:00:00Z') });

test('poprawne zgłoszenie trafia do Make i zwraca 200', async () => {
  const f = fakeFetch();
  const res = await handleLead(post(good), opts(f));
  assert.equal(res.status, 200);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].url, 'https://hook.eu2.make.com/x');
  assert.equal(f.calls[0].body.email, 'anna@firma.pl');
  assert.equal(f.calls[0].body.submitted_at, '2026-10-30T12:00:00.000Z');
});

test('bot dostaje 200, ale nic nie idzie do Make', async () => {
  const f = fakeFetch();
  const res = await handleLead(post({ ...good, website: 'spam' }), opts(f));
  assert.equal(res.status, 200);
  assert.equal(f.calls.length, 0);
});

test('złe dane: 422 z listą błędów, nic nie idzie do Make', async () => {
  const f = fakeFetch();
  const res = await handleLead(post({ ...good, email: 'zly', consent: false }), opts(f));
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.ok(body.errors.email && body.errors.consent);
  assert.equal(f.calls.length, 0);
});

test('tylko POST, tylko JSON, limit rozmiaru', async () => {
  const f = fakeFetch();
  assert.equal((await handleLead(new Request('https://strona.pl/api/lead'), opts(f))).status, 405);
  assert.equal((await handleLead(post('to nie json'), opts(f))).status, 400);
  assert.equal((await handleLead(post({ ...good, message: 'x'.repeat(20000) }), opts(f))).status, 413);
});

test('Make nie działa albo brak adresu: 502 i 500', async () => {
  assert.equal((await handleLead(post(good), opts(fakeFetch(500)))).status, 502);
  assert.equal((await handleLead(post(good), { ...opts(fakeFetch()), webhookUrl: '' })).status, 500);
});
