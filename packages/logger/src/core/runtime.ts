import type { LogLevel, Writer } from "../types.js"

export function isTTY(): boolean {
  return process.stdout.isTTY === true
}

export function createDefaultWriter(): Writer {
  return {
    out: (message: string) => process.stdout.write(`${message}\n`),
    err: (message: string) => process.stderr.write(`${message}\n`),
  }
}

export function shouldUseErrorStream(level: LogLevel): boolean {
  return level === "error" || level === "warn"
}
