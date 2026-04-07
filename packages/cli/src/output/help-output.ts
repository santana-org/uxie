import { cyan, dim, gray, green, yellow } from "@santana-org/colors"
import { buildBrandHeader } from "../branding/brand-header.js"
import type { CliArgumentDefinition, CliOptionDefinition, CommandSpec } from "../types.js"

function identity(value: string): string {
  return value
}

function stripTokens(flags: string): string[] {
  return flags
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

function formatFlagToken(token: string): string {
  return token.replace(/\s*[<\[].*$/, "")
}

function optionPrintName(option: CliOptionDefinition): string {
  return stripTokens(option.flags).map(formatFlagToken).join(", ")
}

function argumentUsage(argument: CliArgumentDefinition): string {
  const trimmed = argument.name.trim()
  if (trimmed.startsWith("<") || trimmed.startsWith("[")) return trimmed
  return `<${trimmed}>`
}

function commandUsage(command: CommandSpec): string {
  const parts: string[] = []
  if (command.options.length > 0 || command.version !== undefined) parts.push("[options]")
  if (command.commands.length > 0) parts.push("[command]")
  for (const argument of command.arguments) parts.push(argumentUsage(argument))
  return parts.join(" ")
}

function commandPath(command: CommandSpec): string {
  const names: string[] = []
  let current: CommandSpec | undefined = command
  while (current !== undefined) {
    names.push(current.name)
    current = current.parent
  }
  return names.reverse().join(" ")
}

function rootCommand(command: CommandSpec): CommandSpec {
  let current: CommandSpec = command
  while (current.parent !== undefined) current = current.parent
  return current
}

// Section formatting helpers
function formatSection(title: string, lines: string[], colorsEnabled: boolean): string {
  if (lines.length === 0) return ""
  const heading = colorsEnabled ? gray(title) : title
  return [heading, ...lines.map((line) => `  ${line}`)].join("\n")
}

function formatOptions(options: CliOptionDefinition[], colorsEnabled: boolean): string[] {
  const stylize = colorsEnabled
    ? { option: yellow, description: gray, fallback: dim }
    : { option: identity, description: identity, fallback: identity }

  return options.map((option) => {
    const label = stylize.option(optionPrintName(option))
    const description = option.description ? ` ${stylize.description(option.description)}` : ""
    const fallback =
      option.defaultValue !== undefined
        ? ` ${stylize.fallback(`[default: ${String(option.defaultValue)}]`)}`
        : ""
    return `${label}${description}${fallback}`
  })
}

function formatArguments(arguments_: CliArgumentDefinition[], colorsEnabled: boolean): string[] {
  const stylize = colorsEnabled
    ? { label: green, description: gray }
    : { label: identity, description: identity }

  return arguments_.map((argument) => {
    const label = stylize.label(argumentUsage(argument))
    const description = argument.description ? ` ${stylize.description(argument.description)}` : ""
    return `${label}${description}`
  })
}

function buildHelpOptions(command: CommandSpec): CliOptionDefinition[] {
  const base: CliOptionDefinition[] = [...command.options]

  if (command.version !== undefined && command.parent === undefined) {
    base.push({
      flags: "-V, --version",
      description: "display version",
      defaultValue: command.version,
    })
  }

  // --help always last
  base.push({
    flags: "-h, --help",
    description: "display help for command",
  })

  return base
}

/**
 * Builds the full help output for a command.
 */
export function buildHelp(command: CommandSpec, colorsEnabled: boolean): string {
  const palette = colorsEnabled
    ? { primary: cyan, muted: gray, success: green }
    : { primary: identity, muted: identity, success: identity }

  const root = rootCommand(command)

  const lines: string[] = [
    ...buildBrandHeader(root.branding, colorsEnabled),
    `${palette.primary("Usage:")} ${palette.primary(commandPath(command))} ${commandUsage(command)}`.trimEnd(),
  ]

  if (command.description) {
    lines.push("")
    lines.push(palette.muted(command.description))
  }

  const commandLines = command.commands.map((child) => {
    const description = child.description ? ` ${palette.muted(child.description)}` : ""
    return `${palette.success(child.name)}${description}`
  })

  const argumentLines = formatArguments(command.arguments, colorsEnabled)
  const optionLines = formatOptions(buildHelpOptions(command), colorsEnabled)

  if (commandLines.length > 0) {
    lines.push("")
    lines.push(formatSection("Commands:", commandLines, colorsEnabled))
  }

  if (argumentLines.length > 0) {
    lines.push("")
    lines.push(formatSection("Arguments:", argumentLines, colorsEnabled))
  }

  if (optionLines.length > 0) {
    lines.push("")
    lines.push(formatSection("Options:", optionLines, colorsEnabled))
  }

  // collapse consecutive blank lines
  return lines.filter((line, i, all) => !(line === "" && (i === 0 || all[i - 1] === ""))).join("\n")
}

/**
 * Creates a help printer bound to a fixed color mode.
 */
export function createHelpPrinter(colorsEnabled: boolean) {
  return (command: CommandSpec): string => buildHelp(command, colorsEnabled)
}
