import { type DateFormatterConfig, formatDate } from "../date-formatter.js"
import { serializeValue } from "../serialization/serialize-value.js"
import type { Formatter, LogEntry, LogLevel } from "../types.js"
import type { FormatterConfig } from "./formatter-config.js"

interface JsonLogOutput {
  level: LogLevel
  message: string
  timestamp?: string
  label?: string
  data?: unknown[]
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

export function createJsonFormatter(config: FormatterConfig = {}): Formatter {
  return (entry: LogEntry): string => {
    const output: JsonLogOutput = {
      level: entry.level,
      message: entry.message,
    }

    if (entry.timestamp) {
      output.timestamp = formatDate(entry.timestamp, buildDateFormatterConfig(config))
    }

    if (entry.label) {
      output.label = entry.label
    }

    if (entry.args.length > 0) {
      output.data = entry.args.map((arg) =>
        config.redact !== undefined
          ? serializeValue(arg, { redact: config.redact })
          : serializeValue(arg),
      )
    }

    return JSON.stringify(output)
  }
}
