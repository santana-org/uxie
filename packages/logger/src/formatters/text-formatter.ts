import { ansi, paint, type AnsiCode } from "@santana-org/colors"
import { type DateFormatterConfig, formatDate } from "../date-formatter.js"
import { serializeValue } from "../serialization/serialize-value.js"
import type { Formatter, LogEntry, LogLevel } from "../types.js"
import type { FormatterConfig } from "./formatter-config.js"

const LEVEL_COLORS: Record<LogLevel, AnsiCode> = {
  debug: ansi.gray,
  info: ansi.cyan,
  success: ansi.green,
  warn: ansi.yellow,
  error: ansi.red,
}

const LEVEL_LABELS: Record<LogLevel, string> = {
  debug: "DBG",
  info: "INF",
  success: "SUC",
  warn: "WRN",
  error: "ERR",
}

function buildDateFormatterConfig(config: FormatterConfig): DateFormatterConfig {
  const dateConfig: DateFormatterConfig = {}
  if (config.dateFormat !== undefined) {
    dateConfig.format = config.dateFormat
  }
  if (config.dateFormatter !== undefined) {
    dateConfig.formatter = config.dateFormatter
  }
  return dateConfig
}

export function createTextFormatter(config: FormatterConfig = {}): Formatter {
  return (entry: LogEntry, colors: boolean): string => {
    const parts: string[] = []

    if (entry.timestamp) {
      const ts = formatDate(entry.timestamp, buildDateFormatterConfig(config))
      parts.push(paint(ts, ansi.dim, colors))
    }

    const levelColor = LEVEL_COLORS[entry.level]
    const levelLabel = LEVEL_LABELS[entry.level]
    parts.push(paint(levelLabel, levelColor, colors))

    if (entry.label) {
      parts.push(paint(`[${entry.label}]`, ansi.magenta, colors))
    }

    parts.push(entry.message)

    if (entry.args.length > 0) {
      const extras = entry.args
        .map((arg) => {
          const serialized =
            config.redact !== undefined
              ? serializeValue(arg, { redact: config.redact })
              : serializeValue(arg)
          return typeof serialized === "object"
            ? JSON.stringify(serialized, null, 2)
            : String(serialized)
        })
        .join(" ")
      parts.push(extras)
    }

    return parts.join(" ")
  }
}

export const defaultFormatter = createTextFormatter()
