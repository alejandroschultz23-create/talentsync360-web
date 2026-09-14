const COMMAND_OPTIONS = {
  queue: new Set(["limit"]),
  inspect: new Set(["submission"]),
  coherence: new Set(["submission", "input"]),
  "start-review": new Set(["submission", "actor"]),
  "publish-profile": new Set(["submission", "input"]),
  "log-time": new Set(["submission", "input"]),
} as const;

export type OperatorCommand = keyof typeof COMMAND_OPTIONS;

export type ParsedOperatorArguments = {
  command: OperatorCommand;
  options: Record<string, string>;
};

export function parseOperatorArguments(
  argv: readonly string[],
): ParsedOperatorArguments {
  const command = argv[0] as OperatorCommand | undefined;
  if (!command || !(command in COMMAND_OPTIONS)) {
    throw new Error(
      "Command must be one of: queue, inspect, coherence, start-review, publish-profile, log-time",
    );
  }

  const allowedOptions: ReadonlySet<string> = COMMAND_OPTIONS[command];
  const options: Record<string, string> = {};

  for (let index = 1; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith("--") || !value || value.startsWith("--")) {
      throw new Error("Options must use --name value pairs");
    }

    const name = flag.slice(2);
    if (!allowedOptions.has(name) || name === "force") {
      throw new Error(`Unsupported option for ${command}: --${name}`);
    }
    if (name in options) {
      throw new Error(`Duplicate option: --${name}`);
    }
    options[name] = value;
  }

  return { command, options };
}

export function requireOption(
  options: Record<string, string>,
  name: string,
): string {
  const value = options[name];
  if (!value) {
    throw new Error(`Missing required option: --${name}`);
  }
  return value;
}
