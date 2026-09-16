import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment(): ServerEnvironment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const result = serverEnvironmentSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  });

  if (!result.success) {
    const names = result.error.issues
      .map((issue) => issue.path[0])
      .filter((name): name is string => typeof name === "string");
    throw new Error(
      `Missing or invalid server environment variables: ${[...new Set(names)].join(", ")}`,
    );
  }

  cachedEnvironment = result.data;
  return cachedEnvironment;
}
