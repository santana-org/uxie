import { formatCliError } from "../output/cli-error.js"
import { executeCommand } from "./command-runner.js"
import { createHelpPrinter } from "../output/help-output.js"
import type { CliAction, CliCommandBuilder, CliOptions, CliWriter, CommandSpec } from "../types.js"

function createWriter(writer?: CliWriter): CliWriter {
  if (writer !== undefined) {
    return writer
  }

  return {
    out: (message) => {
      console.log(message)
    },
    err: (message) => {
      console.error(message)
    },
  }
}

// Command tree factories
function createCommandSpec(name: string, parent?: CommandSpec): CommandSpec {
  return {
    name,
    parent,
    options: [],
    arguments: [],
    commands: [],
  }
}

// Builder API
function createCommandApi(
  spec: CommandSpec,
  root: CommandSpec,
  writer: CliWriter,
  colorsEnabled: boolean,
): CliCommandBuilder {
  const help = createHelpPrinter(colorsEnabled)

  return {
    name(value: string) {
      spec.name = value
      return this
    },
    description(value: string) {
      spec.description = value
      return this
    },
    version(value: string) {
      root.version = value
      return this
    },
    option(flags: string, description?: string, defaultValue?: unknown) {
      spec.options.push({ flags, description, defaultValue })
      return this
    },
    argument(name: string, description?: string) {
      spec.arguments.push({ name, description })
      return this
    },
    command(name: string, description?: string) {
      const child = createCommandSpec(name, spec)
      child.description = description
      spec.commands.push(child)
      return createCommandApi(child, root, writer, colorsEnabled)
    },
    action(action: CliAction) {
      spec.action = action
      return this
    },
    async parse(argv: readonly string[] = process.argv.slice(2)) {
      try {
        return await executeCommand(root, argv, writer, help)
      } catch (error) {
        writer.err(formatCliError(error, { colorsEnabled }))
        return 1
      }
    },
    help() {
      return help(spec)
    },
  }
}

/**
 * Creates a CLI builder instance.
 */
export function createCli(options: CliOptions = {}): CliCommandBuilder {
  const root = createCommandSpec(options.name ?? "cli")
  root.description = options.description
  root.version = options.version
  root.branding = options.branding

  const writer = createWriter(options.writer)
  const colorsEnabled = options.colors ?? process.stdout.isTTY === true

  return createCommandApi(root, root, writer, colorsEnabled)
}
