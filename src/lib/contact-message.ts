import type { Language } from '@/context/translations';

// Existing acquisition intents only; this does not change routing or the API payload.
const COMMERCIAL_INTENTS = new Set([
  'free-trial',
  'pilot',
  'shortlist',
  'shortlist-sprint',
  'ongoing-partner',
  'partner-delivery',
  'demo',
  'validate-role',
]);

export function formatContactMessage(
  message: string,
  intent: string | null,
  language: Language,
): string {
  if (!intent || !COMMERCIAL_INTENTS.has(intent)) return message;

  const label = language === 'es' ? 'Intención comercial' : 'Commercial intent';
  return `${message}\n\n[${label}: ${intent}]`;
}
