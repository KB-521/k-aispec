import path from "node:path";

import type { CommandContext } from "./types";

import { runInitCommand } from "./commands/init";
import { runUninstallCommand } from "./commands/uninstall";
import { runUpdateCommand } from "./commands/update";
import { ExitCode } from "./core/constants";
import { isCliError } from "./core/errors";
import { parseProfile, parseScope } from "./core/scope";

type OptionType = "boolean" | "string";

interface OptionDefinition {
  name: string;
  type: OptionType;
}

const HELP_TEXT = `OpenSpec CLI

Usage:
  openspec <command> [options]

Commands:
  init       Install managed .codex/skills and openspec assets
  update     Apply package-to-project diffs safely
  uninstall  Remove managed assets from the target project

Global:
  -h, --help Show help
`;

const COMMAND_HELP: Record<string, string> = {
  init: `openspec init [options]

Options:
  --scope <all|skills|openspec>
  --profile <default|full-compat>
  --force
  --dry-run
`,
  update: `openspec update [options]

Options:
  --scope <all|skills|openspec>
  --check
  --force
  --backup / --no-backup
  --dry-run
`,
  uninstall: `openspec uninstall [options]

Options:
  --scope <all|skills|openspec>
  --backup / --no-backup
  --force
  --dry-run
`
};

const DEFAULT_CONTEXT = (): CommandContext => ({
  cwd: process.cwd(),
  packageRoot: path.resolve(__dirname, "..", ".."),
  stdout: process.stdout,
  stderr: process.stderr,
  now: () => new Date()
});

const parseOptions = (
  args: string[],
  definitions: OptionDefinition[]
): Record<string, unknown> => {
  const definitionMap = new Map(definitions.map((definition) => [definition.name, definition]));
  const parsed: Record<string, unknown> = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "-h" || token === "--help") {
      parsed.help = true;
      continue;
    }

    if (!token.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }

    const negative = token.startsWith("--no-");
    const optionName = negative ? token.slice(5) : token.slice(2);
    const definition = definitionMap.get(optionName);
    if (!definition) {
      throw new Error(`Unknown option: ${token}`);
    }

    const key = optionName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (definition.type === "boolean") {
      parsed[key] = !negative;
      continue;
    }

    if (negative) {
      throw new Error(`Option ${token} does not support the --no- prefix.`);
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for option: ${token}`);
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
};

export const run = async (
  argv: string[],
  partialContext: Partial<CommandContext> = {}
): Promise<number> => {
  const context = { ...DEFAULT_CONTEXT(), ...partialContext };
  const [command, ...rest] = argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    context.stdout.write(`${HELP_TEXT}`);
    return ExitCode.OK;
  }

  try {
    if (command === "init") {
      const parsed = parseOptions(rest, [
        { name: "scope", type: "string" },
        { name: "profile", type: "string" },
        { name: "force", type: "boolean" },
        { name: "dry-run", type: "boolean" }
      ]);
      if (parsed.help) {
        context.stdout.write(COMMAND_HELP.init);
        return ExitCode.OK;
      }

      return runInitCommand(context, {
        scope: parseScope(parsed.scope ?? "all"),
        profile: parseProfile(parsed.profile),
        force: Boolean(parsed.force),
        dryRun: Boolean(parsed.dryRun)
      });
    }

    if (command === "update") {
      const parsed = parseOptions(rest, [
        { name: "scope", type: "string" },
        { name: "check", type: "boolean" },
        { name: "force", type: "boolean" },
        { name: "backup", type: "boolean" },
        { name: "dry-run", type: "boolean" }
      ]);
      if (parsed.help) {
        context.stdout.write(COMMAND_HELP.update);
        return ExitCode.OK;
      }

      return runUpdateCommand(context, {
        scope: parseScope(parsed.scope ?? "all"),
        check: Boolean(parsed.check),
        force: Boolean(parsed.force),
        backup: parsed.backup === undefined ? true : Boolean(parsed.backup),
        dryRun: Boolean(parsed.dryRun)
      });
    }

    if (command === "uninstall") {
      const parsed = parseOptions(rest, [
        { name: "scope", type: "string" },
        { name: "backup", type: "boolean" },
        { name: "force", type: "boolean" },
        { name: "dry-run", type: "boolean" }
      ]);
      if (parsed.help) {
        context.stdout.write(COMMAND_HELP.uninstall);
        return ExitCode.OK;
      }

      return runUninstallCommand(context, {
        scope: parseScope(parsed.scope ?? "all"),
        backup: parsed.backup === undefined ? true : Boolean(parsed.backup),
        force: Boolean(parsed.force),
        dryRun: Boolean(parsed.dryRun)
      });
    }

    context.stderr.write(`Unknown command: ${command}\n`);
    context.stderr.write(HELP_TEXT);
    return ExitCode.USAGE;
  } catch (error) {
    if (isCliError(error)) {
      context.stderr.write(`${error.message}\n`);
      return error.exitCode;
    }

    const message = error instanceof Error ? error.message : String(error);
    context.stderr.write(`${message}\n`);
    return ExitCode.FAILURE;
  }
};

export const main = async (): Promise<void> => {
  const exitCode = await run(process.argv.slice(2));
  process.exitCode = exitCode;
};

if (require.main === module) {
  void main();
}
