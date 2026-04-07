import { cyan, red } from "@santana-org/colors"

export interface CliErrorFormatOptions {
  colorsEnabled: boolean
  command?: string
}

/**
 * Error type used for user-facing input and parsing problems.
 */
export class CliInputError extends Error {
  context: string | undefined
  suggestion: string

  constructor(message: string, suggestion: string, context?: string) {
    super(message)
    this.name = "CliInputError"
    this.context = context
    this.suggestion = suggestion
  }
}

function identity(value: string): string {
  return value
}

/**
 * Formats an error message for terminal output.
 */
export function formatCliError(error: unknown, options: CliErrorFormatOptions): string {
  const paintError = options.colorsEnabled ? red : identity
  const paintHint = options.colorsEnabled ? cyan : identity

  if (error instanceof CliInputError) {
    const lines: string[] = []

    lines.push("")
    lines.push(paintError(`✗ ${error.message}`))

    if (error.context && error.context.length > 0) {
      lines.push("")
      lines.push(`  ${error.context}`)
    }

    lines.push("")

    const suggestion = options.command
      ? error.suggestion.replace(/(?<=run |see |use )[\w\s-]+--[\w-]+/g, (match) =>
          paintHint(match),
        )
      : error.suggestion

    lines.push(`  ${suggestion}`)
    lines.push("")

    return lines.join("\n")
  }

  const hint = options.command ? paintHint(`${options.command} --help`) : "--help"

  return [
    "",
    paintError("✗ command failed"),
    "",
    "  an unexpected error occurred while running this command",
    `  try again with ${hint} or check your command input`,
    "",
  ].join("\n")
}
