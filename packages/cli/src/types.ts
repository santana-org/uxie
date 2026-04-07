export interface CliWriter {
  out(message: string): void
  err(message: string): void
}

export interface CliOptionDefinition {
  flags: string
  description?: string | undefined
  defaultValue?: unknown
}

export interface CliArgumentDefinition {
  name: string
  description?: string | undefined
}

export interface CliCommandContext {
  command: string
  path: string[]
  options: Record<string, unknown>
  positionals: Record<string, string | string[] | undefined>
  args: string[]
  rawArgs: string[]
  stdout(message: string): void
  stderr(message: string): void
}

export type CliAction = (context: CliCommandContext) => void | Promise<void>

export interface CliBranding {
  title?: string | undefined
  tagline?: string | undefined
  badge?: string | undefined
}

export interface CliOptions {
  name?: string
  description?: string | undefined
  version?: string | undefined
  branding?: CliBranding | undefined
  colors?: boolean
  writer?: CliWriter
}

export interface CliCommandBuilder {
  name(value: string): CliCommandBuilder
  description(value: string): CliCommandBuilder
  version(value: string): CliCommandBuilder
  option(flags: string, description?: string, defaultValue?: unknown): CliCommandBuilder
  argument(name: string, description?: string): CliCommandBuilder
  command(name: string, description?: string): CliCommandBuilder
  action(action: CliAction): CliCommandBuilder
  parse(argv?: readonly string[]): Promise<number>
  help(): string
}

export interface ParsedOptionSpec {
  key: string
  shortNames: string[]
  longNames: string[]
  description?: string | undefined
  defaultValue?: unknown
  expectsValue: boolean
}

export interface ParsedArgumentSpec {
  key: string
  description?: string | undefined
  required: boolean
  variadic: boolean
}

export interface CommandSpec {
  name: string
  description?: string | undefined
  version?: string | undefined
  branding?: CliBranding | undefined
  options: CliOptionDefinition[]
  arguments: CliArgumentDefinition[]
  commands: CommandSpec[]
  action?: CliAction
  parent?: CommandSpec | undefined
}
