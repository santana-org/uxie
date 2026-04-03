import type { RedactionPattern } from "./types.js"

export interface SerializedError {
  name: string
  message: string
  stack?: string
}

export interface SerializeOptions {
  redact?: RedactionPattern[]
}

interface JsonSerializable {
  toJSON: () => unknown
}

function hasToJSON(value: object): value is JsonSerializable {
  return "toJSON" in value && typeof value.toJSON === "function"
}

function shouldRedactKey(key: string, patterns: RedactionPattern[] = []): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return pattern.toLowerCase() === key.toLowerCase()
    }
    return pattern.test(key)
  })
}

export function isError(value: unknown): value is Error {
  return value instanceof Error
}

export function serializeError(error: Error): SerializedError {
  return {
    name: error.name,
    message: error.message,
    ...(error.stack ? { stack: error.stack } : {}),
  }
}

export function serializeValue(value: unknown, options: SerializeOptions = {}): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (isError(value)) {
    return serializeError(value)
  }

  if (typeof value === "object" && hasToJSON(value)) {
    return serializeValue(value.toJSON(), options)
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item, options))
  }

  if (typeof value === "object") {
    const serialized: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (shouldRedactKey(key, options.redact)) {
        serialized[key] = "[REDACTED]"
      } else {
        serialized[key] = serializeValue(val, options)
      }
    }
    return serialized
  }

  return value
}
