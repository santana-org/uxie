import { describe, expect, it } from "vitest"
import { createLogger } from "../logger.js"
import { makeWriter } from "./test-utils.js"

describe("createLogger", () => {
  it("returns a logger with all log methods", () => {
    const logger = createLogger()
    expect(typeof logger.debug).toBe("function")
    expect(typeof logger.info).toBe("function")
    expect(typeof logger.warn).toBe("function")
    expect(typeof logger.error).toBe("function")
    expect(typeof logger.success).toBe("function")
    expect(typeof logger.child).toBe("function")
  })

  it("outputs messages to writer.out for non-error levels", () => {
    const { out, err, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    logger.debug("hello debug")
    logger.info("hello info")
    logger.success("hello success")

    expect(out).toHaveLength(3)
    expect(err).toHaveLength(0)
  })

  it("outputs messages to writer.err for warn and error levels", () => {
    const { out, err, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    logger.warn("a warning")
    logger.error("an error")

    expect(out).toHaveLength(0)
    expect(err).toHaveLength(2)
  })

  it("creates a child logger with the given label", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })
    const child = logger.child("myModule")

    child.info("child message")

    expect(out[0]).toContain("[myModule]")
  })
})

describe("level filtering", () => {
  it("suppresses messages below the minimum level", () => {
    const { out, err, writer } = makeWriter()
    const logger = createLogger({ level: "warn", writer, colors: false })

    logger.debug("debug msg")
    logger.info("info msg")
    logger.success("success msg")

    expect(out).toHaveLength(0)
    expect(err).toHaveLength(0)
  })

  it("passes messages at or above the minimum level", () => {
    const { err, writer } = makeWriter()
    const logger = createLogger({ level: "warn", writer, colors: false })

    logger.warn("warn msg")
    logger.error("error msg")

    expect(err).toHaveLength(2)
  })

  it("defaults to debug level (all messages pass)", () => {
    const { out, err, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    logger.debug("d")
    logger.info("i")
    logger.success("s")
    logger.warn("w")
    logger.error("e")

    expect(out.length + err.length).toBe(5)
  })
})
