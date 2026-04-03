import { describe, expect, it } from "vitest"
import { createLogger } from "../logger.js"
import { makeWriter } from "./test-utils.js"

describe("JSON format", () => {
  it("outputs JSON format when format='json'", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json" })

    logger.info("test message")

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")
    expect(parsed.level).toBe("info")
    expect(parsed.message).toBe("test message")
  })

  it("includes label in JSON output", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json", label: "api" })

    logger.info("request")

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")
    expect(parsed.label).toBe("api")
  })

  it("includes timestamp in JSON when enabled", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json", timestamps: true })

    logger.info("event")

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")
    expect(parsed.timestamp).toBeDefined()
  })

  it("serializes data arguments in JSON format", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json" })

    logger.info("user action", { userId: 123, action: "login" })

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")
    expect(parsed.data).toEqual([{ userId: 123, action: "login" }])
  })

  it("serializes Error objects in JSON format", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json" })

    const error = new Error("something failed")
    logger.error("operation failed", error)

    expect(out).toHaveLength(0)
    expect(out.length + 1).toBe(1)
  })

  it("child logger inherits JSON format from parent", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json" })
    const child = logger.child("db")

    child.info("query")

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")
    expect(parsed.level).toBe("info")
    expect(parsed.label).toBe("db")
  })
})

describe("error handling", () => {
  it("extracts error details when Error object is passed", () => {
    const { err, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false, format: "json" })

    const error = new Error("connection failed")
    logger.error("db error", error)

    expect(err).toHaveLength(1)
    const first = err[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")
    expect(parsed.data[0].name).toBe("Error")
    expect(parsed.data[0].message).toBe("connection failed")
  })

  it("uses text format for Error objects when not JSON", () => {
    const { err, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    const error = new Error("test error")
    logger.error("error occurred", error)

    expect(err).toHaveLength(1)
    expect(err[0]).toContain("Error: test error")
  })
})
