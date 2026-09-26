import { describe, expect, it } from "vitest";

import { parseOperatorArguments } from "./arguments";

describe("Operator Arguments Parser", () => {
  it("parses deliver-profile with submission, actor, and expires-hours", () => {
    const result = parseOperatorArguments([
      "deliver-profile",
      "--submission",
      "00000000-0000-4000-8000-000000000001",
      "--actor",
      "operator-reviewer",
      "--expires-hours",
      "48",
    ]);

    expect(result.command).toBe("deliver-profile");
    expect(result.options.submission).toBe("00000000-0000-4000-8000-000000000001");
    expect(result.options.actor).toBe("operator-reviewer");
    expect(result.options["expires-hours"]).toBe("48");
  });

  it("parses reissue-access with submission, actor, and expires-hours", () => {
    const result = parseOperatorArguments([
      "reissue-access",
      "--submission",
      "00000000-0000-4000-8000-000000000001",
      "--actor",
      "operator-reviewer",
    ]);

    expect(result.command).toBe("reissue-access");
    expect(result.options.submission).toBe("00000000-0000-4000-8000-000000000001");
    expect(result.options.actor).toBe("operator-reviewer");
  });

  it("parses revoke-access with submission and actor", () => {
    const result = parseOperatorArguments([
      "revoke-access",
      "--submission",
      "00000000-0000-4000-8000-000000000001",
      "--actor",
      "operator-reviewer",
    ]);

    expect(result.command).toBe("revoke-access");
    expect(result.options.submission).toBe("00000000-0000-4000-8000-000000000001");
  });

  it("parses revise-profile with submission and input file", () => {
    const result = parseOperatorArguments([
      "revise-profile",
      "--submission",
      "00000000-0000-4000-8000-000000000001",
      "--input",
      "revision.json",
    ]);

    expect(result.command).toBe("revise-profile");
    expect(result.options.input).toBe("revision.json");
  });

  it("strictly forbids --force on any command", () => {
    expect(() =>
      parseOperatorArguments([
        "deliver-profile",
        "--submission",
        "00000000-0000-4000-8000-000000000001",
        "--actor",
        "operator",
        "--force",
        "true",
      ]),
    ).toThrow(/Unsupported option/);
  });

  it("rejects unknown options", () => {
    expect(() =>
      parseOperatorArguments([
        "deliver-profile",
        "--submission",
        "00000000-0000-4000-8000-000000000001",
        "--unknown",
        "value",
      ]),
    ).toThrow(/Unsupported option/);
  });

  it("rejects duplicate options", () => {
    expect(() =>
      parseOperatorArguments([
        "deliver-profile",
        "--submission",
        "00000000-0000-4000-8000-000000000001",
        "--actor",
        "operator-1",
        "--actor",
        "operator-2",
      ]),
    ).toThrow(/Duplicate option/);
  });
});
