import { describe, expect, it } from 'vitest';
import { formatContactMessage } from './contact-message';

describe('contact commercial intent', () => {
  it.each([
    'free-trial', 'pilot', 'shortlist', 'shortlist-sprint',
    'ongoing-partner', 'partner-delivery', 'demo', 'validate-role',
  ])('retains %s inside the existing message field', (intent) => {
    const original = 'First line\nSecond line — requirements remain verbatim.';
    expect(formatContactMessage(original, intent, 'en')).toBe(
      `${original}\n\n[Commercial intent: ${intent}]`,
    );
  });

  it('localizes the metadata without translating the acquisition identifier', () => {
    expect(formatContactMessage('Necesito revisar un candidato.', 'free-trial', 'es'))
      .toBe('Necesito revisar un candidato.\n\n[Intención comercial: free-trial]');
  });

  it.each([null, '', 'unknown-offer', '<script>alert(1)</script>', 'demo\nInjected'])
    ('keeps legacy messages unchanged for absent or unrecognized intent %s', (intent) => {
      expect(formatContactMessage(' Original message\n', intent, 'en')).toBe(' Original message\n');
    });
});
