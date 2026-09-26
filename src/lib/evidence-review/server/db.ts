import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../database.types";
import { getServerEnvironment } from "./env";

let databaseClient: SupabaseClient<Database> | undefined;

export function getDatabaseClient(): SupabaseClient<Database> {
  if (databaseClient) {
    return databaseClient;
  }

  const environment = getServerEnvironment();
  databaseClient = createClient<Database>(
    environment.SUPABASE_URL,
    environment.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
      global: {
        headers: { "X-Client-Info": "talentsync360-opt-in-v1a" },
      },
    },
  );

  return databaseClient;
}
