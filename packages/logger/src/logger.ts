import { createDefaultFormatter } from "./formatters.js"
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
    dateFormat,
    dateFormatter,
    formatter,
    writer = defaultWriter(),
  } = options

  const formatterConfig: {
    dateFormat?: import("./date-formatter.js").DateFormat
    dateFormatter?: import("./date-formatter.js").DateFormatterFn
  } = {}
  if (dateFormat !== undefined) {
    formatterConfig.dateFormat = dateFormat
  }
  if (dateFormatter !== undefined) {
    formatterConfig.dateFormatter = dateFormatter
  }
  const resolvedFormatter = formatter || createDefaultFormatter(formatterConfig)

  function log(logLevel: LogLevel, message: string, ...args: unknown[]): void {
    if (!isLevelEnabled(logLevel, minLevel)) {
      return
    }

    const entry: LogEntry = {
      level: logLevel,
      message,
      ...(label !== undefined ? { label } : {}),
      ...(timestamps ? { timestamp: new Date() } : {}),
      args,
    }

    const formatted = resolvedFormatter(entry, colors)

    if (isErrorLevel(logLevel)) {
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
    child: (childLabel) => {
      const childOptions: LoggerOptions = {
        level: minLevel,
        label: childLabel,
        timestamps,
        colors,
        writer,
      }
      if (dateFormat !== undefined) {
        childOptions.dateFormat = dateFormat
      }
      if (dateFormatter !== undefined) {
        childOptions.dateFormatter = dateFormatter
      }
      if (formatter !== undefined) {
        childOptions.formatter = formatter
      }
      return createLogger(childOptions)
    },
  }
}
