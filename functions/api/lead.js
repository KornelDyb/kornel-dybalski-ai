// Cloudflare Pages Function: obsługuje /api/lead.
// Adres webhooka Make jest w sekrecie MAKE_WEBHOOK_URL (ustawienia projektu w Cloudflare).
import { handleLead } from '../../src/lib/lead-handler.js';

export const onRequest = ({ request, env }) =>
  handleLead(request, { webhookUrl: env.MAKE_WEBHOOK_URL });
