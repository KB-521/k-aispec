import { ExitCode } from "./constants";

export class CliError extends Error {
  exitCode: number;

  constructor(message: string, exitCode = ExitCode.FAILURE) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
  }
}

export const isCliError = (error: unknown): error is CliError =>
  error instanceof CliError;
