export const ansi = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
} as const

export type AnsiCode = (typeof ansi)[keyof typeof ansi]

export function paint(text: string, code: AnsiCode, enabled = true): string {
  return enabled ? `${code}${text}${ansi.reset}` : text
}

export const dim = (text: string, enabled = true): string => paint(text, ansi.dim, enabled)
export const gray = (text: string, enabled = true): string => paint(text, ansi.gray, enabled)
export const cyan = (text: string, enabled = true): string => paint(text, ansi.cyan, enabled)
export const green = (text: string, enabled = true): string => paint(text, ansi.green, enabled)
export const yellow = (text: string, enabled = true): string => paint(text, ansi.yellow, enabled)
export const red = (text: string, enabled = true): string => paint(text, ansi.red, enabled)
export const magenta = (text: string, enabled = true): string => paint(text, ansi.magenta, enabled)
