import {
  type FormatterConfig,
  createDefaultFormatter,
  createJsonFormatter,
} from "../formatters/index.js"
import { isLevelEnabled } from "../levels.js"
import type { LogEntry, LogLevel, Logger, LoggerOptions } from "../types.js"
import { createDefaultWriter, isTTY, shouldUseErrorStream } from "./runtime.js"

function buildFormatterConfig(options: LoggerOptions): FormatterConfig {
  const config: FormatterConfig = {}

  if (options.dateFormat !== undefined) {
    config.dateFormat = options.dateFormat
  }
  if (options.dateFormatter !== undefined) {
    config.dateFormatter = options.dateFormatter
  }
  if (options.redact !== undefined) {
    config.redact = options.redact
  }

  return config
}

function resolveFormatter(options: LoggerOptions) {
  const config = buildFormatterConfig(options)

  return (
    options.formatter ??
    (options.format === "json" ? createJsonFormatter(config) : createDefaultFormatter(config))
  )
}

/**
 * Creates a logger instance with configurable formatting, output, and level filtering.
 * @param options - Logger behavior options.
 * @returns Logger instance.
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const {
    level: minLevel = "debug",
    label,
    timestamps = false,
    format = "text",
    colors = isTTY(),
    writer = createDefaultWriter(),
  } = options

  const resolvedFormatter = resolveFormatter({ ...options, format })

  function log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!isLevelEnabled(level, minLevel)) {
      // Skip work early when this level is below the configured threshold.
      return
    }

    const entry: LogEntry = {
      level,
      message,
      ...(label !== undefined ? { label } : {}),
      ...(timestamps ? { timestamp: new Date() } : {}),
      args,
    }

    const formatted = resolvedFormatter(entry, colors)

    if (shouldUseErrorStream(level)) {
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
        ...options,
        level: minLevel,
        // Child logger keeps parent runtime behavior and only changes identity label.
        label: childLabel,
        timestamps,
        format,
        colors,
        writer,
      }),
  }
}
