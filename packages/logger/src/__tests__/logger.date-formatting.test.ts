import { describe, expect, it } from "vitest"
import { createLogger } from "../logger.js"
import { makeWriter } from "./test-utils.js"

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
