// Cloudflare Worker: obsługuje /api/lead, resztę oddaje jako pliki strony (folder dist).
// Adres webhooka Make jest w sekrecie MAKE_WEBHOOK_URL (Settings > Variables and Secrets).
import { handleLead } from '../src/lib/lead-handler.js';
import { handleDemo } from '../src/lib/demo.js';
import { handleChat } from '../src/lib/chat-ai.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/lead') {
      return handleLead(request, { webhookUrl: env.MAKE_WEBHOOK_URL });
    }
    if (url.pathname === '/api/demo') {
      return handleDemo(request, env);
    }
    if (url.pathname === '/api/chat') {
      return handleChat(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    // Adres testowy *.workers.dev nie trafia do Google. Na własnej domenie ten nagłówek znika.
    if (url.hostname.endsWith('.workers.dev')) {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return response;
  },
};
