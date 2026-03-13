import { defaultFormatter } from "./formatters.js"
import { isLevelEnabled } from "./levels.js"
import type { LogEntry, LogLevel, Logger, LoggerOptions, Writer } from "./types.js"

function isTTY(): boolean {
  return process.stdout.isTTY === true
}

function defaultWriter(): Writer {
  return {
    out: (message: string) => process.stdout.write(`${message}\n`),
    err: (message: string) => process.stderr.write(`${message}\n`),
  }
}

function isErrorLevel(level: LogLevel): boolean {
  return level === "error" || level === "warn"
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const {
    level: minLevel = "debug",
    label,
    timestamps = false,
    colors = isTTY(),
    formatter = defaultFormatter,
    writer = defaultWriter(),
  } = options

  function log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!isLevelEnabled(level, minLevel)) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      ...(label !== undefined ? { label } : {}),
      ...(timestamps ? { timestamp: new Date() } : {}),
      args,
    }

    const formatted = formatter(entry, colors)

    if (isErrorLevel(level)) {
      writer.err(formatted)
    } else {
      writer.out(formatted)
    }
  }

  return {
    debug: (message, ...args) => log("debug", message, ...args),
    info: (message, ...args) => log("info", message, ...args),
    warn: (message, ...args) => log("warn", message, ...args),
    error: (message, ...args) => log("error", message, ...args),
    success: (message, ...args) => log("success", message, ...args),
    child: (childLabel) =>
      createLogger({
        level: minLevel,
        label: childLabel,
        timestamps,
        colors,
        formatter,
        writer,
      }),
  }
}
