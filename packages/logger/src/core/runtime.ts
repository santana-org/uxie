import type { LogLevel, Writer } from "../types.js"

/**
 * Detects whether stdout is connected to an interactive terminal.
 * @returns `true` when stdout is a TTY.
 */
export function isTTY(): boolean {
  return process.stdout.isTTY === true
}

/**
 * Creates the default writer that emits one log entry per line.
 * @returns Writer implementation backed by process streams.
 */
export function createDefaultWriter(): Writer {
  return {
    out: (message: string) => process.stdout.write(`${message}\n`),
    err: (message: string) => process.stderr.write(`${message}\n`),
  }
}

/**
 * Chooses whether a level should be written to stderr.
 * @param level - Log level.
 * @returns `true` for warning and error levels.
 */
export function shouldUseErrorStream(level: LogLevel): boolean {
  return level === "error" || level === "warn"
}
