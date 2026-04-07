import type { CliCommandContext, CliWriter, CommandSpec, ParsedOptionSpec } from "../types.js"
import {
  parseOptionTokens,
  parsePositionals,
  toArgumentSpec,
  toOptionSpec,
} from "../parsing/option-parsing.js"

function toBuiltInOptions(spec: CommandSpec): ParsedOptionSpec[] {
  const builtIns: ParsedOptionSpec[] = [
    {
      key: "help",
      shortNames: ["h"],
      longNames: ["help"],
      description: "display help for command",
      expectsValue: false,
    },
  ]

  if (spec.parent === undefined && spec.version !== undefined) {
    builtIns.push({
      key: "version",
      shortNames: ["V"],
      longNames: ["version"],
      description: "display version",
      defaultValue: spec.version,
      expectsValue: false,
    })
  }

  return builtIns
}

function buildOptionSpecs(spec: CommandSpec): ParsedOptionSpec[] {
  return [...toBuiltInOptions(spec), ...spec.options.map(toOptionSpec)]
}

function findSubcommand(spec: CommandSpec, name: string): CommandSpec | undefined {
  return spec.commands.find((command) => command.name === name)
}

function buildContext(
  command: CommandSpec,
  options: Record<string, unknown>,
  positionals: Record<string, string | string[] | undefined>,
  args: string[],
  rawArgs: string[],
  writer: CliWriter,
): CliCommandContext {
  return {
    command: command.name,
    path: buildPath(command),
    options,
    positionals,
    args,
    rawArgs,
    stdout: writer.out,
    stderr: writer.err,
  }
}

/**
 * Builds the command path from the root to the current command.
 */
export function buildPath(command: CommandSpec): string[] {
  const path: string[] = []
  let current: CommandSpec | undefined = command

  while (current !== undefined) {
    path.push(current.name)
    current = current.parent
  }

  return path.reverse()
}

/**
 * Executes a command tree against the provided argv tokens.
 */
export async function executeCommand(
  command: CommandSpec,
  tokens: readonly string[],
  writer: CliWriter,
  showHelp: (spec: CommandSpec) => string,
  inheritedOptions: Record<string, unknown> = {},
): Promise<number> {
  const optionSpecs = buildOptionSpecs(command)
  const { values, rest } = parseOptionTokens(tokens, optionSpecs, command.parent === undefined)
  const mergedOptions = { ...inheritedOptions, ...values }
  const builtinOptions = values as { help?: unknown; version?: unknown }

  if (builtinOptions.help === true) {
    writer.out(showHelp(command))
    return 0
  }

  if (
    builtinOptions.version === true &&
    command.parent === undefined &&
    command.version !== undefined
  ) {
    writer.out(command.version)
    return 0
  }

  const nextToken = rest[0]
  const nextCommand = nextToken === undefined ? undefined : findSubcommand(command, nextToken)

  if (nextCommand !== undefined) {
    return executeCommand(nextCommand, rest.slice(1), writer, showHelp, mergedOptions)
  }

  const { positionals, args } = parsePositionals(command.arguments.map(toArgumentSpec), rest)

  if (command.action === undefined) {
    writer.out(showHelp(command))
    return 0
  }

  await command.action(buildContext(command, mergedOptions, positionals, args, [...rest], writer))
  return 0
}
