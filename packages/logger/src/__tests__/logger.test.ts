import { describe, expect, it, vi } from "vitest"
import { createLogger } from "../logger.js"
import type { LogEntry, Writer } from "../types.js"

function makeWriter(): { out: string[]; err: string[]; writer: Writer } {
  const out: string[] = []
  const err: string[] = []
  return {
    out,
    err,
    writer: {
      out: (msg) => out.push(msg),
      err: (msg) => err.push(msg),
    },
  }
}

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

describe("date formatting", () => {
  it("uses ISO format by default when timestamps enabled", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false, timestamps: true, dateFormat: "iso" })

    logger.info("test")

    expect(out[0]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it("formats timestamp as HH:mm:ss with time format", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false, timestamps: true, dateFormat: "time" })

    logger.info("test")

    expect(out[0]).toMatch(/\d{2}:\d{2}:\d{2}/)
  })

  it("formats timestamp as YYYY-MM-DD HH:mm:ss with datetime format", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({ writer, colors: false, timestamps: true, dateFormat: "datetime" })

    logger.info("test")

    expect(out[0]).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
  })

  it("uses custom date formatter when provided", () => {
    const { out, writer } = makeWriter()
    const customFormatter = (date: Date) => `[${date.getFullYear()}]`

    const logger = createLogger({
      writer,
      colors: false,
      timestamps: true,
      dateFormatter: customFormatter,
    })

    logger.info("test")

    expect(out[0]).toMatch(/\[\d{4}\]/)
  })

  it("child logger inherits date format from parent", () => {
    const { out, writer } = makeWriter()
    const logger = createLogger({
      writer,
      colors: false,
      timestamps: true,
      dateFormat: "time",
    })
    const child = logger.child("db")

    child.info("test")

    expect(out[0]).toMatch(/\d{2}:\d{2}:\d{2}/)
  })
})

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
