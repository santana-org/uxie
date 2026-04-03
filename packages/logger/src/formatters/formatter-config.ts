import type { DateFormat, DateFormatterFn } from "../date-formatter.js"
import type { RedactionPattern } from "../types.js"

export interface FormatterConfig {
  dateFormat?: DateFormat
  dateFormatter?: DateFormatterFn
  redact?: RedactionPattern[]
}
