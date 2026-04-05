export type DateFormat = "iso" | "time" | "datetime" | "custom"

export type DateFormatterFn = (date: Date) => string

export interface DateFormatterConfig {
  format?: DateFormat
  formatter?: DateFormatterFn
}

const FORMATTERS: Record<DateFormat, DateFormatterFn> = {
  iso: (date: Date) => date.toISOString(),

  time: (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  },

  datetime: (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  },

  custom: (date: Date) => date.toISOString(),
}

/**
 * Formats a date using either a built-in format or a caller-provided formatter.
 * @param date - Date to format.
 * @param config - Optional formatting configuration.
 * @returns Formatted date string.
 */
export function formatDate(date: Date, config: DateFormatterConfig = {}): string {
  const { format = "iso", formatter } = config

  if (formatter) {
    // Custom formatter takes precedence over named presets.
    return formatter(date)
  }

  const formatFn = FORMATTERS[format]
  return formatFn(date)
}
