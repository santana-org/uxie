import { describe, expect, it, vi } from "vitest"
import { createLogger } from "../core/create-logger.js"
import type { LogEntry } from "../types.js"
import { makeWriter } from "./test-utils.js"

describe("message formatting", () => {
  it("includes the message in output", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    logger.info("hello world")

    expect(out[0]).toContain("hello world")
  })

  it("includes the label when provided", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ label: "app", writer, colors: false })

    logger.info("labeled message")

    expect(out[0]).toContain("[app]")
  })

  it("includes a timestamp when timestamps option is enabled", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ timestamps: true, writer, colors: false })

    logger.info("with time")

    expect(out[0]).toMatch(/\d{4}-\d{2}-\d{2}T/)
  })

  it("does not include timestamp by default", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    logger.info("no time")

    expect(out[0]).not.toMatch(/\d{4}-\d{2}-\d{2}T/)
  })

  it("includes extra args in output", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false })

    logger.info("msg", "extra", 42)

    expect(out[0]).toContain("extra")
    expect(out[0]).toContain("42")
  })
})

describe("custom formatter", () => {
  it("calls the custom formatter with the log entry", () => {
    const { writer } = makeWriter()
    const formatter = vi.fn((_entry: LogEntry, _colors: boolean) => "custom output")
    const logger = createLogger({ formatter, writer, colors: false })

    logger.info("test message")

    expect(formatter).toHaveBeenCalledOnce()
    const [entry, colors] = formatter.mock.calls[0] as [LogEntry, boolean]
    expect(entry.level).toBe("info")
    expect(entry.message).toBe("test message")
    expect(colors).toBe(false)
  })

  it("uses the custom formatter output", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({
      formatter: () => "CUSTOM_FORMAT",
      writer,
      colors: false,
    })

    logger.info("anything")

    expect(out[0]).toBe("CUSTOM_FORMAT")
  })
})
