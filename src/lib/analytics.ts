'use client';

import { sendGTMEvent } from '@next/third-parties/google';

// Prohibited PII keys that must never be sent to dataLayer/GA4
const PROHIBITED_PII_KEYS = new Set([
  'name',
  'firstname',
  'lastname',
  'email',
  'phone',
  'phonenumber',
  'company',
  'companyname',
  'message',
  'messagebody',
  'rawinput',
  'input',
  'text',
]);

export interface GTMEventParams {
  page_path?: string;
  page_location?: string;
  cta_label?: string;
  cta_location?: string;
  destination?: string;
  form_type?: string;
  language?: string;
  [key: string]: unknown;
}

/**
 * Clean parameters to ensure no PII fields pass through to GTM/GA4.
 */
function sanitizeParams(params?: GTMEventParams): Record<string, unknown> {
  if (!params) return {};

  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (PROHIBITED_PII_KEYS.has(lowerKey)) {
      continue;
    }
    // Only accept primitive safe types (strings, numbers, booleans)
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Dispatch a clean GTM event to window.dataLayer via @next/third-parties/google.
 */
export function pushGTMEvent(eventName: string, params?: GTMEventParams): void {
  if (typeof window === 'undefined') return;

  const safeParams = sanitizeParams(params);

  sendGTMEvent({
    event: eventName,
    ...safeParams,
  });
}
