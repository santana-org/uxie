// Public API
export { createCli } from "./runtime/create-cli.js"

// Branding helpers
export { buildBrandHeader, createBrandHeader, resolveBranding } from "./branding/index.js"

// Output helpers
export { buildHelp, CliInputError, createHelpPrinter, formatCliError } from "./output/index.js"

// Parsing helpers
export {
  parseOptionTokens,
  parsePositionals,
  toArgumentSpec,
  toOptionSpec,
} from "./parsing/index.js"

// Runtime helpers
export { buildPath, executeCommand } from "./runtime/index.js"

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
