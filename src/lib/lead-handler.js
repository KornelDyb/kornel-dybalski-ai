// Serwerowa obsługa formularza (funkcja Cloudflare Pages /api/lead, plik functions/api/lead.js).
// Adres webhooka Make zna tylko serwer, więc nie da się go podejrzeć w kodzie strony.
import { validate, isBot, buildPayload } from './form.js';

const MAX_BYTES = 10_000;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export async function handleLead(request, { webhookUrl, fetchImpl = fetch, now = new Date() }) {
  if (request.method !== 'POST') return json(405, { error: 'method' });

  const raw = await request.text();
  if (raw.length > MAX_BYTES) return json(413, { error: 'too_large' });

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { error: 'json' });
  }
  if (!data || typeof data !== 'object') return json(400, { error: 'json' });

  // Botowi odpowiadamy jak człowiekowi, ale niczego nie przekazujemy dalej.
  if (isBot(data)) return json(200, { ok: true });

  const errors = validate(data);
  if (Object.keys(errors).length > 0) return json(422, { errors });

  if (!webhookUrl) return json(500, { error: 'config' });

  try {
    const res = await fetchImpl(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(buildPayload(data, now)),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return json(502, { error: 'upstream' });
  } catch {
    return json(502, { error: 'upstream' });
  }
  return json(200, { ok: true });
}
