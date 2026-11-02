import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleDemo, renderEmail, parseIdeas, escapeHtml } from '../src/lib/demo.js';

const lead = {
  name: 'Anna', email: 'anna@firma.pl', company: 'Kwiaciarnia <Róża>', size: '5-20',
  message: 'Odpisujemy na zapytania po kilku dniach, bo nikt nie pilnuje skrzynki.',
};
const ideas = {
  intro: 'Z Twojego opisu wynika, że najwięcej czasu ucieka na skrzynkę.',
  ideas: [
    { title: 'Automatyczna odpowiedź', problem: 'Klient czeka dniami.', how: 'Formularz wysyła od razu maila z terminami.' },
    { title: 'Jedna lista zapytań', problem: 'Zapytania giną.', how: 'Każde zapytanie trafia do CRM.' },
  ],
  questions: ['Ile zapytań dostajecie tygodniowo?'],
  slides: [{ title: 'Problem', bullets: ['Odpowiedź po kilku dniach'] }],
};

const env = {
  DEMO_SECRET: 's3cret', OPENAI_API_KEY: 'sk-test', OPENAI_MODEL: 'test-model',
  OWNER_EMAIL: 'korneldybalski@gmail.com', DEMO_MODE: 'test',
};
const post = (body, secret = 's3cret') => new Request('https://strona.pl/api/demo', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-demo-secret': secret },
  body: JSON.stringify(body),
});
const fakeOpenAI = (content, status = 200) => {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), auth: init.headers.authorization });
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(content) } }] }), { status });
  };
  fn.calls = calls;
  return fn;
};

test('escapeHtml zabezpiecza tekst od użytkownika', () => {
  assert.equal(escapeHtml('<b>"x" & \'y\'</b>'), '&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;');
});

test('parseIdeas odrzuca niekompletną odpowiedź AI', () => {
  assert.throws(() => parseIdeas('{"ideas":[]}'));
  assert.throws(() => parseIdeas('to nie json'));
  assert.equal(parseIdeas(JSON.stringify(ideas)).ideas.length, 2);
});

test('mail: dane klienta są zabezpieczone, jest oznaczenie AI i link do kalendarza', () => {
  const html = renderEmail(lead, ideas);
  assert.ok(html.includes('Kwiaciarnia &lt;Róża&gt;'));
  assert.ok(!html.includes('<Róża>'));
  assert.ok(html.includes('przygotowane przez AI'));
  assert.ok(html.includes('https://calendar.app.google/'));
  assert.ok(html.includes('Automatyczna odpowiedź'));
});

test('bez sekretu: 401, nic nie idzie do OpenAI', async () => {
  const f = fakeOpenAI(ideas);
  const res = await handleDemo(post(lead, 'zly'), env, f);
  assert.equal(res.status, 401);
  assert.equal(f.calls.length, 0);
});

test('tryb testowy: mail idzie do właściciela z dopiskiem, dla kogo był', async () => {
  const f = fakeOpenAI(ideas);
  const res = await handleDemo(post(lead), env, f);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.to, 'korneldybalski@gmail.com');
  assert.ok(body.subject.startsWith('[TEST dla anna@firma.pl]'));
  assert.ok(body.html.includes('Automatyczna odpowiedź'));
  assert.equal(body.slides.length, 1);
  assert.equal(f.calls[0].body.model, 'test-model');
  assert.equal(f.calls[0].auth, 'Bearer sk-test');
});

test('tryb produkcyjny: mail idzie do klienta', async () => {
  const res = await handleDemo(post(lead), { ...env, DEMO_MODE: 'live' }, fakeOpenAI(ideas));
  const body = await res.json();
  assert.equal(body.to, 'anna@firma.pl');
  assert.ok(!body.subject.includes('TEST'));
});

test('zły lead: 422; błąd OpenAI albo zła odpowiedź: 502; brak klucza: 500', async () => {
  assert.equal((await handleDemo(post({ ...lead, email: 'zly' }), env, fakeOpenAI(ideas))).status, 422);
  assert.equal((await handleDemo(post(lead), env, fakeOpenAI(ideas, 500))).status, 502);
  assert.equal((await handleDemo(post(lead), env, fakeOpenAI({ ideas: [] }))).status, 502);
  assert.equal((await handleDemo(post(lead), { ...env, OPENAI_API_KEY: '' }, fakeOpenAI(ideas))).status, 500);
});
