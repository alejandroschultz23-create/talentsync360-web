import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  const { runEvidenceReviewOperator } = await import(
    "../../src/lib/evidence-review/operator/cli"
  );

  await runEvidenceReviewOperator(process.argv.slice(2));
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Operator command failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
