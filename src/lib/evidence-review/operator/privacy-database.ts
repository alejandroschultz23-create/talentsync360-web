import postgres from "postgres";

import type { ReviewState } from "../domain";

export type PrivacyClosureReason =
  | "RETENTION_90_DAYS"
  | "RETENTION_DECLINED_180_DAYS"
  | "WITHDRAWAL"
  | "PRIVACY_REQUEST";

export type PrivacyClosurePreview = {
  exists: boolean;
  eligible: boolean;
  submission_id: string;
  reason?: PrivacyClosureReason;
  review_state?: ReviewState;
  active_network?: boolean;
  profile_count?: number;
  last_meaningful_activity_at?: string;
  due_at?: string | null;
};

export type PrivacyRetentionQueueItem = {
  submission_id: string;
  category: string;
  review_state: ReviewState;
  last_activity_at: string;
  due_at: string;
  is_due: boolean;
};

type OperatorSql = ReturnType<typeof postgres>;

type ClosureAudit = {
  id: string;
  occurred_at: Date;
  audit_expires_at: Date;
};

async function withPrivacyDatabase<T>(operation: (sql: OperatorSql) => Promise<T>): Promise<T> {
  const connectionUrl = process.env.SUPABASE_DB_URL;
  if (!connectionUrl) {
    throw new Error("Privacy lifecycle commands require local SUPABASE_DB_URL; the application service key is insufficient");
  }
  if (process.env.VERCEL) {
    throw new Error("Privacy lifecycle commands must run from an authorized operator environment");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(connectionUrl);
    if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    throw new Error("SUPABASE_DB_URL must be a PostgreSQL connection URL");
  }

  let sql: OperatorSql;
  try {
    sql = postgres(connectionUrl, {
      max: 1,
      ssl: "require",
      prepare: false,
      connect_timeout: 10,
    });
  } catch {
    throw new Error("Unable to initialize the privileged operator database connection");
  }
  try {
    let identity: { db_role: string } | undefined;
    try {
      [identity] = await sql<{ db_role: string }[]>`select current_user as db_role`;
    } catch {
      throw new Error("Unable to connect to the privileged operator database");
    }
    if (identity?.db_role !== "postgres") {
      throw new Error("Privacy lifecycle commands require the postgres database-owner role");
    }
    return await operation(sql);
  } catch (error) {
    if (!(error instanceof Error)) throw new Error("Privacy database operation failed");
    const sensitive = [connectionUrl, parsedUrl.password];
    try { sensitive.push(decodeURIComponent(parsedUrl.password)); } catch { /* URL parsing already succeeded. */ }
    let message = error.message;
    for (const value of sensitive.filter(Boolean)) message = message.replaceAll(value, '[redacted]');
    throw new Error(message);
  } finally {
    await sql.end({ timeout: 5 }).catch(() => undefined);
  }
}

export function listPrivacyRetentionQueue(limit: number): Promise<PrivacyRetentionQueueItem[]> {
  return withPrivacyDatabase(async (sql) => {
    const rows = await sql<PrivacyRetentionQueueItem[]>`
      select * from private.privacy_retention_queue(${limit})`;
    return [...rows];
  });
}

export function recordPrivacyCaseActivity(submissionId: string, actor: string): Promise<Date> {
  return withPrivacyDatabase(async (sql) => {
    const [row] = await sql<{ occurred_at: Date }[]>`
      select private.record_privacy_case_activity(${submissionId}::uuid, ${actor}) as occurred_at`;
    if (!row) throw new Error("Privacy activity procedure returned no result");
    return row.occurred_at;
  });
}

export function withdrawTalentNetwork(submissionId: string, actor: string): Promise<{ id: string; withdrawn_at: Date }> {
  return withPrivacyDatabase(async (sql) => {
    const [row] = await sql<{ id: string; withdrawn_at: Date }[]>`
      select id, withdrawn_at from private.withdraw_talent_network(${submissionId}::uuid, ${actor})`;
    if (!row) throw new Error("Privacy withdrawal procedure returned no result");
    return row;
  });
}

export function previewPrivacyCaseClosure(
  submissionId: string,
  reason: PrivacyClosureReason,
): Promise<PrivacyClosurePreview> {
  return withPrivacyDatabase(async (sql) => {
    const [row] = await sql<{ preview: PrivacyClosurePreview }[]>`
      select private.preview_privacy_case_closure(${submissionId}::uuid, ${reason}) as preview`;
    if (!row) throw new Error("Privacy closure preview returned no result");
    return row.preview;
  });
}

export function closePrivacyCase(input: {
  submissionId: string;
  actor: string;
  reason: PrivacyClosureReason;
  confirmSubmissionId: string;
}): Promise<ClosureAudit> {
  return withPrivacyDatabase(async (sql) => {
    const [row] = await sql<ClosureAudit[]>`
      select id, occurred_at, audit_expires_at from private.close_privacy_case(
        ${input.submissionId}::uuid, ${input.actor}, ${input.reason}, ${input.confirmSubmissionId}::uuid)`;
    if (!row) throw new Error("Privacy closure procedure returned no result");
    return row;
  });
}
