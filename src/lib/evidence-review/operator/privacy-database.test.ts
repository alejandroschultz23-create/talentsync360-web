import { afterEach, describe, expect, it } from 'vitest';

import { listPrivacyRetentionQueue } from './privacy-database';

const originalUrl = process.env.SUPABASE_DB_URL;

afterEach(() => {
  if (originalUrl === undefined) delete process.env.SUPABASE_DB_URL;
  else process.env.SUPABASE_DB_URL = originalUrl;
});

describe('privileged privacy operator connection', () => {
  it('fails closed when the local database credential is absent', async () => {
    delete process.env.SUPABASE_DB_URL;
    await expect(listPrivacyRetentionQueue(1))
      .rejects.toThrow(/require local SUPABASE_DB_URL/);
  });

  it('rejects a service API URL in place of a PostgreSQL connection', async () => {
    process.env.SUPABASE_DB_URL = 'https://example.invalid';
    await expect(listPrivacyRetentionQueue(1))
      .rejects.toThrow(/PostgreSQL connection URL/);
  });
});
