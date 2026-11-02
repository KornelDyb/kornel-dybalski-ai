import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleDemo, renderClientEmail, renderOwnerEmail, hooksFor, parseIdeas, escapeHtml } from '../src/lib/demo.js';

const lead = {
  name: 'Anna', email: 'anna@firma.pl', company: 'Kwiaciarnia <Róża>', size: '5-20',
  message: 'Odpisujemy na zapytania po kilku dniach, bo nikt nie pilnuje skrzynki.',
};
const ideas = {
  specific: true,
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

test('mail do klienta: krótki, termin, zapowiedzi pomysłów bez szczegółów, dane zabezpieczone', () => {
  const html = renderClientEmail({ ...lead, name: 'Anna <b>' }, hooksFor(ideas));
  assert.ok(html.includes('Anna &lt;b&gt;'));
  assert.ok(html.includes('https://calendar.app.google/'));
  assert.ok(html.includes('Automatyczna odpowiedź'));
  assert.ok(!html.includes('Formularz wysyła od razu maila'), 'bez opisu „jak działa”');
  const plain = renderClientEmail(lead, []);
  assert.ok(plain.includes('Jak wygląda rozmowa'));
  assert.deepEqual(hooksFor({ ...ideas, specific: false }), []);
});

test('mail do Kornela: lead, link do CRM i pełna ściąga; przy błędzie AI informacja zamiast ściągi', () => {
  const html = renderOwnerEmail(lead, { ai: ideas, crmUrl: 'https://app-eu1.hubspot.com/contacts/1', hooks: hooksFor(ideas) });
  assert.ok(html.includes('Kwiaciarnia &lt;Róża&gt;'));
  assert.ok(html.includes('Kontakt w HubSpot'));
  assert.ok(html.includes('Formularz wysyła od razu maila'));
  assert.ok(html.includes('Ile zapytań dostajecie tygodniowo?'));
  const failed = renderOwnerEmail(lead, { error: 'anthropic: 529' });
  assert.ok(failed.includes('Pomysły od AI nie powstały'));
});

test('bez sekretu: 401, nic nie idzie do AI', async () => {
  const f = fakeClaude(ideas);
  const res = await handleDemo(post(lead, 'zly'), env, f);
  assert.equal(res.status, 401);
  assert.equal(f.calls.length, 0);
});

test('tryb testowy (Claude): klient dostaje sam termin, Kornel jeden mail ze ściągą i podglądem zapowiedzi', async () => {
  const f = fakeClaude(ideas);
  const res = await handleDemo(post({ ...lead, crm_url: 'https://app-eu1.hubspot.com/contacts/9' }), env, f);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.live, false);
  assert.equal(body.ai, 'ok');
  assert.equal(body.client.to, 'anna@firma.pl');
  assert.ok(!body.client.html.includes('Automatyczna odpowiedź'));
  assert.equal(body.owner.to, 'korneldybalski@gmail.com');
  assert.ok(body.owner.subject.includes('[TEST]'));
  assert.ok(body.owner.html.includes('W trybie live klient dostałby'));
  assert.ok(body.owner.html.includes('app-eu1.hubspot.com/contacts/9'));
  assert.equal(body.slides.length, 1);
  const call = f.calls[0];
  assert.ok(call.url.startsWith('https://api.anthropic.com/v1/messages'));
  assert.equal(call.body.model, 'claude-opus-5-5');
  assert.equal(call.body.fallbacks, 'default');
  assert.equal(call.body.output_config.format.type, 'json_schema');
  assert.ok(call.body.output_config.format.schema.required.includes('specific'));
  assert.ok(`${call.headers.get('x-api-key')} ${call.headers.get('authorization')}`.includes('sk-ant-test'));
  assert.ok(call.headers.get('anthropic-beta').includes('server-side-fallback-2026-07-01'));
});

test('błąd AI: dalej 200, klient dostaje termin, Kornel dostaje informację o błędzie', async () => {
  for (const f of [fakeClaude(ideas, { stopReason: 'refusal' }), fakeClaude(ideas, { status: 500 }), fakeClaude({ ideas: [] })]) {
    const body = await (await handleDemo(post(lead), env, f)).json();
    assert.equal(body.ai, 'failed');
    assert.ok(body.client.html.includes('https://calendar.app.google/'));
    assert.ok(body.owner.html.includes('Pomysły od AI nie powstały'));
    assert.ok(body.owner.subject.includes('bez pomysłów AI'));
  }
});

test('podejrzany link do CRM jest pomijany', async () => {
  const body = await (await handleDemo(post({ ...lead, crm_url: 'https://zly.pl/x' }), env, fakeClaude(ideas))).json();
  assert.ok(!body.owner.html.includes('zly.pl'));
});

test('OpenAI jako opcja: AI_PROVIDER=openai', async () => {
  const f = fakeOpenAI(ideas);
  const res = await handleDemo(post(lead), openaiEnv, f);
  assert.equal(res.status, 200);
  assert.equal(f.calls[0].body.model, 'test-model');
  assert.equal(f.calls[0].auth, 'Bearer sk-test');
});

test('tryb produkcyjny: klient dostaje termin i zapowiedzi; przy ogólnym opisie sam termin', async () => {
  const body = await (await handleDemo(post(lead), { ...env, DEMO_MODE: 'live' }, fakeClaude(ideas))).json();
  assert.equal(body.client.to, 'anna@firma.pl');
  assert.ok(body.client.html.includes('Automatyczna odpowiedź'));
  assert.ok(!body.owner.subject.includes('TEST'));
  assert.ok(body.owner.html.includes('Klient dostał'));
  const vague = await (await handleDemo(post(lead), { ...env, DEMO_MODE: 'live' }, fakeClaude({ ...ideas, specific: false }))).json();
  assert.ok(!vague.client.html.includes('Automatyczna odpowiedź'));
  assert.ok(vague.owner.html.includes('Opis był ogólny'));
});

test('zły lead: 422; brak klucza: 500; błąd dostawcy: 200 z ai=failed', async () => {
  assert.equal((await handleDemo(post({ ...lead, email: 'zly' }), env, fakeClaude(ideas))).status, 422);
  assert.equal((await (await handleDemo(post(lead), openaiEnv, fakeOpenAI(ideas, 500))).json()).ai, 'failed');
  assert.equal((await handleDemo(post(lead), { ...env, ANTHROPIC_API_KEY: '' }, fakeClaude(ideas))).status, 500);
  assert.equal((await handleDemo(post(lead), { ...openaiEnv, OPENAI_API_KEY: '' }, fakeOpenAI(ideas))).status, 500);
});

test('Gemini jako opcja: AI_PROVIDER=gemini, klucz w nagłówku, wynik sprawdzany', async () => {
  const calls = [];
  const fakeGemini = (content, status = 200) => async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), key: init.headers['x-goog-api-key'] });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(content) }] } }] }), { status });
  };
  const geminiEnv = { ...env, AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'g-key', GEMINI_MODEL: 'gemini-test', GEMINI_RETRY_DELAYS: [0, 0] };
  const res = await handleDemo(post(lead), geminiEnv, fakeGemini(ideas));
  assert.equal(res.status, 200);
  assert.ok(calls[0].url.includes('/models/gemini-test:generateContent'));
  assert.equal(calls[0].key, 'g-key');
  assert.equal(calls[0].body.generationConfig.responseMimeType, 'application/json');
  assert.equal((await (await handleDemo(post(lead), geminiEnv, fakeGemini({ ideas: [] }))).json()).ai, 'failed');
  assert.equal((await (await handleDemo(post(lead), geminiEnv, fakeGemini(ideas, 429))).json()).ai, 'failed');
  assert.equal((await handleDemo(post(lead), { ...geminiEnv, GEMINI_MODEL: '' }, fakeGemini(ideas))).status, 500);
});

test('nieznany dostawca AI: 500 zamiast cichego błędu', async () => {
  assert.equal((await handleDemo(post(lead), { ...env, AI_PROVIDER: 'cos' }, fakeClaude(ideas))).status, 500);
});

test('przyjmuje też pola formularza (tak wysyła Make), znaki specjalne bez problemu', async () => {
  const f = fakeClaude(ideas);
  const form = new URLSearchParams({ ...lead, message: 'Cudzysłów " i nowa\nlinia & znak < > działają.' });
  const req = new Request('https://strona.pl/api/demo', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-demo-secret': 's3cret' },
    body: form.toString(),
  });
  const res = await handleDemo(req, env, f);
  assert.equal(res.status, 200);
  assert.ok(f.calls[0].body.messages[0].content.includes('Cudzysłów " i nowa\nlinia & znak < >'));
});

test('Gemini: przy 503 ponawia i za drugim razem się udaje', async () => {
  let n = 0;
  const flaky = async () => {
    n++;
    if (n === 1) return new Response('{"error":{"code":503}}', { status: 503 });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(ideas) }] } }] }), { status: 200 });
  };
  const geminiEnv = { ...env, AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'g', GEMINI_MODEL: 'm', GEMINI_RETRY_DELAYS: [0, 0] };
  const res = await handleDemo(post(lead), geminiEnv, flaky);
  assert.equal(res.status, 200);
  assert.equal(n, 2);
});

test('Gemini: gdy pierwszy model jest przeciążony, używa następnego z listy', async () => {
  const urls = [];
  const fn = async (url) => {
    urls.push(url);
    if (url.includes('/models/pierwszy:')) return new Response('{"error":{"code":503}}', { status: 503 });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(ideas) }] } }] }), { status: 200 });
  };
  const geminiEnv = { ...env, AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'g', GEMINI_MODEL: 'pierwszy, drugi', GEMINI_RETRY_DELAYS: [0] };
  const res = await handleDemo(post(lead), geminiEnv, fn);
  assert.equal(res.status, 200);
  assert.equal(urls.filter((u) => u.includes('/models/pierwszy:')).length, 2);
  assert.ok(urls.at(-1).includes('/models/drugi:'));
});

test('Claude Haiku (najtańszy): bez parametru fallbacks i bez nagłówka beta', async () => {
  const f = fakeClaude(ideas);
  const res = await handleDemo(post(lead), { ...env, ANTHROPIC_MODEL: 'claude-haiku-5-5' }, f);
  assert.equal(res.status, 200);
  assert.equal(f.calls[0].body.model, 'claude-haiku-5-5');
  assert.equal(f.calls[0].body.fallbacks, undefined);
  assert.ok(!String(f.calls[0].headers.get('anthropic-beta') ?? '').includes('server-side-fallback'));
});
