import { handleLead } from '../../src/lib/lead-handler.js';

export default (request) =>
  handleLead(request, { webhookUrl: process.env.MAKE_WEBHOOK_URL });

// Netlify ogranicza liczbę zgłoszeń: najwyżej 5 na minutę z jednego adresu IP.
export const config = {
  path: '/api/lead',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
