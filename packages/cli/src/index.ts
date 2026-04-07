// Public API
export { createCli } from "./runtime/create-cli.js"

// Branding helpers
export { buildBrandHeader, createBrandHeader, resolveBranding } from "./branding/brand-header.js"

// Output helpers
export { buildHelp, createHelpPrinter } from "./output/help-output.js"
export { CliInputError, formatCliError } from "./output/cli-error.js"

// Parsing helpers
export {
  parseOptionTokens,
  parsePositionals,
  toArgumentSpec,
  toOptionSpec,
} from "./parsing/option-parsing.js"

// Runtime helpers
export { buildPath, executeCommand } from "./runtime/command-runner.js"

// Shared types
export type {
  CliBranding,
  CliAction,
  CliArgumentDefinition,
  CliCommandBuilder,
  CliCommandContext,
  CliOptionDefinition,
  CliOptions,
  CliWriter,
} from "./types.js"
