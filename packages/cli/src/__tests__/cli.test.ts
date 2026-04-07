import { describe, expect, it } from "vitest"
import { createCli } from "../index.js"

function createBufferWriter() {
  const out: string[] = []
  const err: string[] = []

  return {
    out,
    err,
    writer: {
      out: (message: string) => {
        out.push(message)
      },
      err: (message: string) => {
        err.push(message)
      },
    },
  }
}

describe("createCli", () => {
  it("parses top-level flags and subcommand arguments", async () => {
    const { writer } = createBufferWriter()
    const seen: Array<Record<string, unknown>> = []

    const cli = createCli({ name: "demo", writer, colors: false })
      .option("-v, --verbose", "enable verbose mode")
      .command("greet", "print a greeting")
      .argument("<name>", "person to greet")
      .option("-l, --loud", "uppercase the message")
      .action(({ options, positionals, args, path }) => {
        seen.push({ options, positionals, args, path })
      })

    await cli.parse(["--verbose", "greet", "Ada", "--loud"])

    expect(seen).toHaveLength(1)
    expect(seen[0]).toMatchObject({
      options: { verbose: true, help: false, loud: true },
      positionals: { name: "Ada" },
      args: ["Ada"],
      path: ["demo", "greet"],
    })
  })

  it("prints help when requested", async () => {
    const { out, writer } = createBufferWriter()

    const cli = createCli({ name: "demo", description: "Example CLI", writer, colors: false })
      .option("-v, --verbose", "enable verbose mode")
      .command("greet", "print a greeting")

    const exitCode = await cli.parse(["--help"])

    expect(exitCode).toBe(0)
    expect(out[0]).toContain("@santana-org/cli")
    expect(out[0]).toContain("Usage: demo [options] [command]")
    expect(out[0]).toContain("Options:")
  })

  it("accepts custom branding for the root help header", async () => {
    const { out, writer } = createBufferWriter()

    const cli = createCli({
      name: "nova",
      writer,
      colors: false,
      branding: {
        title: "nova",
        tagline: "a gorgeous launcher for internal tools",
        badge: "internal",
      },
    })

    await cli.parse(["--help"])

    expect(out[0]).toContain("nova")
    expect(out[0]).toContain("a gorgeous launcher for internal tools")
    expect(out[0]).toContain("internal")
  })

  it("prints the version when requested", async () => {
    const { out, writer } = createBufferWriter()

    const cli = createCli({ name: "demo", version: "1.2.3", writer, colors: false })

    const exitCode = await cli.parse(["--version"])

    expect(exitCode).toBe(0)
    expect(out).toEqual(["1.2.3"])
  })

  it("supports chained commands with nested help", () => {
    const cli = createCli({ name: "demo", colors: false })
      .command("deploy", "deploy the app")
      .command("preview", "preview the app")

    expect(cli.help()).toContain("Usage: demo deploy preview")
    expect(cli.help()).toContain("preview the app")
  })

  it("formats input errors without exposing raw exceptions", async () => {
    const { err, writer } = createBufferWriter()
    const cli = createCli({ name: "demo", writer, colors: false }).option(
      "-v, --verbose",
      "enable verbose mode",
    )

    const exitCode = await cli.parse(["--nope"])

    expect(exitCode).toBe(1)
    expect(err[0]).toContain("✗ Unknown option: --nope")
    expect(err[0]).toContain("Run --help to see all available options")
    expect(err[0]).not.toContain("Error:")
  })

  it("suggests closest long option for typos", async () => {
    const { err, writer } = createBufferWriter()
    const cli = createCli({ name: "demo", writer, colors: false }).option(
      "-c, --colors",
      "enable colors",
    )

    const exitCode = await cli.parse(["--colros"])

    expect(exitCode).toBe(1)
    expect(err[0]).toContain("✗ Unknown option: --colros")
    expect(err[0]).toContain("Did you mean --colors?")
    expect(err[0]).toContain("Run --help to see all available options")
  })
})
