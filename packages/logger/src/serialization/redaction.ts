import type { RedactionPattern } from "../types.js"

export function shouldRedactKey(key: string, patterns: RedactionPattern[] = []): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return pattern.toLowerCase() === key.toLowerCase()
    }
    return pattern.test(key)
  })
}
