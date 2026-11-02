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
  DEMO_SECRET: 's3cret', ANTHROPIC_API_KEY: 'sk-ant-test',
  OWNER_EMAIL: 'korneldybalski@gmail.com', DEMO_MODE: 'test',
};
const openaiEnv = { ...env, AI_PROVIDER: 'openai', OPENAI_API_KEY: 'sk-test', OPENAI_MODEL: 'test-model' };
const post = (body, secret = 's3cret') => new Request('https://strona.pl/api/demo', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-demo-secret': secret },
  body: JSON.stringify(body),
});
const fakeClaude = (content, { status = 200, stopReason = 'end_turn' } = {}) => {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(init.body), headers: new Headers(init.headers) });
    const body = status === 200
      ? { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', stop_reason: stopReason,
          content: [{ type: 'text', text: JSON.stringify(content) }], usage: { input_tokens: 1, output_tokens: 1 } }
      : { type: 'error', error: { type: 'api_error', message: 'boom' } };
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  };
  fn.calls = calls;
  return fn;
};
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

test('bez sekretu: 401, nic nie idzie do AI', async () => {
  const f = fakeClaude(ideas);
  const res = await handleDemo(post(lead, 'zly'), env, f);
  assert.equal(res.status, 401);
  assert.equal(f.calls.length, 0);
});

test('tryb testowy (Claude): mail idzie do właściciela z dopiskiem, dla kogo był', async () => {
  const f = fakeClaude(ideas);
  const res = await handleDemo(post(lead), env, f);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.to, 'korneldybalski@gmail.com');
  assert.ok(body.subject.startsWith('[TEST dla anna@firma.pl]'));
  assert.ok(body.html.includes('Automatyczna odpowiedź'));
  assert.equal(body.slides.length, 1);
  const call = f.calls[0];
  assert.ok(call.url.startsWith('https://api.anthropic.com/v1/messages'));
  assert.equal(call.body.model, 'claude-opus-5-5');
  assert.equal(call.body.fallbacks, 'default');
  assert.equal(call.body.output_config.format.type, 'json_schema');
  assert.ok(`${call.headers.get('x-api-key')} ${call.headers.get('authorization')}`.includes('sk-ant-test'));
  assert.ok(call.headers.get('anthropic-beta').includes('server-side-fallback-2026-07-01'));
});

test('Claude: odmowa albo błąd API daje 502', async () => {
  assert.equal((await handleDemo(post(lead), env, fakeClaude(ideas, { stopReason: 'refusal' }))).status, 502);
  assert.equal((await handleDemo(post(lead), env, fakeClaude(ideas, { status: 500 }))).status, 502);
});

test('OpenAI jako opcja: AI_PROVIDER=openai', async () => {
  const f = fakeOpenAI(ideas);
  const res = await handleDemo(post(lead), openaiEnv, f);
  assert.equal(res.status, 200);
  assert.equal(f.calls[0].body.model, 'test-model');
  assert.equal(f.calls[0].auth, 'Bearer sk-test');
});

test('tryb produkcyjny: mail idzie do klienta', async () => {
  const res = await handleDemo(post(lead), { ...env, DEMO_MODE: 'live' }, fakeClaude(ideas));
  const body = await res.json();
  assert.equal(body.to, 'anna@firma.pl');
  assert.ok(!body.subject.includes('TEST'));
});

test('zły lead: 422; błąd AI albo zła odpowiedź: 502; brak klucza: 500', async () => {
  assert.equal((await handleDemo(post({ ...lead, email: 'zly' }), env, fakeClaude(ideas))).status, 422);
  assert.equal((await handleDemo(post(lead), openaiEnv, fakeOpenAI(ideas, 500))).status, 502);
  assert.equal((await handleDemo(post(lead), env, fakeClaude({ ideas: [] }))).status, 502);
  assert.equal((await handleDemo(post(lead), { ...env, ANTHROPIC_API_KEY: '' }, fakeClaude(ideas))).status, 500);
  assert.equal((await handleDemo(post(lead), { ...openaiEnv, OPENAI_API_KEY: '' }, fakeOpenAI(ideas))).status, 500);
});

test('Gemini jako opcja: AI_PROVIDER=gemini, klucz w nagłówku, wynik sprawdzany', async () => {
  const calls = [];
  const fakeGemini = (content, status = 200) => async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), key: init.headers['x-goog-api-key'] });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(content) }] } }] }), { status });
  };
  const geminiEnv = { ...env, AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'g-key', GEMINI_MODEL: 'gemini-test' };
  const res = await handleDemo(post(lead), geminiEnv, fakeGemini(ideas));
  assert.equal(res.status, 200);
  assert.ok(calls[0].url.includes('/models/gemini-test:generateContent'));
  assert.equal(calls[0].key, 'g-key');
  assert.equal(calls[0].body.generationConfig.responseMimeType, 'application/json');
  assert.equal((await handleDemo(post(lead), geminiEnv, fakeGemini({ ideas: [] }))).status, 502);
  assert.equal((await handleDemo(post(lead), geminiEnv, fakeGemini(ideas, 429))).status, 502);
  assert.equal((await handleDemo(post(lead), { ...geminiEnv, GEMINI_MODEL: '' }, fakeGemini(ideas))).status, 500);
});

test('nieznany dostawca AI: 500 zamiast cichego błędu', async () => {
  assert.equal((await handleDemo(post(lead), { ...env, AI_PROVIDER: 'cos' }, fakeClaude(ideas))).status, 500);
});
