export interface SerializedError {
  name: string
  message: string
  stack?: string
}

interface JsonSerializable {
  toJSON: () => unknown
}

function hasToJSON(value: object): value is JsonSerializable {
  return "toJSON" in value && typeof value.toJSON === "function"
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

export function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (isError(value)) {
    return serializeError(value)
  }

  if (typeof value === "object" && hasToJSON(value)) {
    return value.toJSON()
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue)
  }

  if (typeof value === "object") {
    const serialized: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      serialized[key] = serializeValue(val)
    }
    return serialized
  }

  return value
}
