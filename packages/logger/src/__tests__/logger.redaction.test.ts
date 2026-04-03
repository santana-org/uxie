import { describe, expect, it } from "vitest"
import { createLogger } from "../core/create-logger.js"
import { makeWriter } from "./test-utils.js"

describe("redaction", () => {
  it("redacts sensitive keys in text format", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false, redact: ["password", "token"] })

    logger.info("login", { user: "alejandro", password: "1234", token: "secret" })

    expect(out).toHaveLength(1)
    expect(out[0]).toContain('"password": "[REDACTED]"')
    expect(out[0]).toContain('"token": "[REDACTED]"')
    expect(out[0]).toContain('"user": "alejandro"')
  })

  it("redacts sensitive keys in JSON format", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json", redact: [/password/i, "apiKey"] })

    logger.info("payload", { password: "abc", apiKey: "xyz", safe: true })

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")

    expect(parsed.data[0].password).toBe("[REDACTED]")
    expect(parsed.data[0].apiKey).toBe("[REDACTED]")
    expect(parsed.data[0].safe).toBe(true)
  })

  it("child logger inherits redaction rules", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, format: "json", redact: ["secret"] })
    const child = logger.child("auth")

    child.info("child payload", { secret: "hidden", visible: "ok" })

    expect(out).toHaveLength(1)
    const first = out[0]
    expect(first).toBeDefined()
    const parsed = JSON.parse(first ?? "{}")

    expect(parsed.data[0].secret).toBe("[REDACTED]")
    expect(parsed.data[0].visible).toBe("ok")
  })
})
