import type {
  CliArgumentDefinition,
  CliOptionDefinition,
  ParsedArgumentSpec,
  ParsedOptionSpec,
} from "../types.js"
import { CliInputError } from "../output/cli-error.js"

function stripFlags(flags: string): string[] {
  return flags
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

function removeValueTokens(token: string): string {
  return token.replace(/\s*[<\[].*$/, "")
}

/**
 * Converts a declared option into the internal parsed option shape.
 */
export function toOptionSpec(option: CliOptionDefinition): ParsedOptionSpec {
  const tokens = stripFlags(option.flags)
  const longNames = tokens
    .filter((token) => token.startsWith("--"))
    .map((token) => removeValueTokens(token).replace(/^--/, ""))
  const shortNames = tokens
    .filter((token) => /^-[^-]/.test(token))
    .map((token) => removeValueTokens(token).replace(/^-/, ""))
  const reference = longNames[0] ?? shortNames[0] ?? ""
  const key = reference
    .replace(/^no-/, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : `${part.charAt(0).toUpperCase()}${part.slice(1)}`))
    .join("")

  return {
    key,
    shortNames,
    longNames,
    description: option.description,
    defaultValue: option.defaultValue,
    expectsValue: /[<[]/.test(option.flags),
  }
}

/**
 * Converts a declared argument into the internal parsed argument shape.
 */
export function toArgumentSpec(argument: CliArgumentDefinition): ParsedArgumentSpec {
  const trimmed = argument.name.trim()
  const required = trimmed.startsWith("<")
  const variadic = trimmed.endsWith("...") || trimmed.includes("...")
  const rawName = trimmed
    .replace(/^[<[\s]+/, "")
    .replace(/[>\]]$/, "")
    .replace(/\.\.\.$/, "")

  return {
    key: rawName,
    description: argument.description,
    required,
    variadic,
  }
}

function createDefaults(options: ParsedOptionSpec[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}

  for (const option of options) {
    if (option.defaultValue !== undefined) {
      values[option.key] = option.defaultValue
    } else if (!option.expectsValue) {
      values[option.key] = false
    }
  }

  return values
}

function normalizeLongToken(token: string): { name: string; value?: string } {
  const parts = token.replace(/^--/, "").split("=", 2)
  const name = parts[0] ?? ""
  const value = parts[1]

  return value === undefined ? { name } : { name, value }
}

function normalizeShortCluster(token: string): string[] {
  return token.replace(/^-/, "").split("")
}

function findOptionByLongName(
  options: ParsedOptionSpec[],
  name: string,
): ParsedOptionSpec | undefined {
  return options.find((option) => option.longNames.includes(name))
}

function findOptionByShortName(
  options: ParsedOptionSpec[],
  name: string,
): ParsedOptionSpec | undefined {
  return options.find((option) => option.shortNames.includes(name))
}

function editDistance(left: string, right: string): number {
  if (left === right) return 0
  if (left.length === 0) return right.length
  if (right.length === 0) return left.length

  const rows = left.length + 1
  const cols = right.length + 1
  const matrix: number[][] = Array.from({ length: rows }, () => Array<number>(cols).fill(0))

  for (let row = 0; row < rows; row += 1) {
    const currentRow = matrix[row]

    if (currentRow === undefined) {
      throw new Error("Failed to initialize distance matrix row")
    }

    currentRow[0] = row
  }

  for (let col = 0; col < cols; col += 1) {
    const firstRow = matrix[0]

    if (firstRow === undefined) {
      throw new Error("Failed to initialize distance matrix column")
    }

    firstRow[col] = col
  }

  for (let row = 1; row < rows; row += 1) {
    const leftChar = left[row - 1]
    const currentRow = matrix[row]
    const previousRow = matrix[row - 1]

    if (currentRow === undefined || previousRow === undefined) {
      throw new Error("Failed to read distance matrix row")
    }

    for (let col = 1; col < cols; col += 1) {
      const rightChar = right[col - 1]
      const cost = leftChar === rightChar ? 0 : 1

      const up = previousRow[col] ?? 0
      const leftValue = currentRow[col - 1] ?? 0
      const diagonal = previousRow[col - 1] ?? 0

      currentRow[col] = Math.min(up + 1, leftValue + 1, diagonal + cost)
    }
  }

  const lastRow = matrix[rows - 1]

  if (lastRow === undefined) {
    throw new Error("Failed to read final distance matrix row")
  }

  return lastRow[cols - 1] ?? 0
}

function findClosestLongOptionName(
  options: ParsedOptionSpec[],
  unknownName: string,
): string | undefined {
  const candidates = [...new Set(options.flatMap((option) => option.longNames))]

  if (candidates.length === 0) {
    return undefined
  }

  let bestName: string | undefined
  let bestDistance = Number.POSITIVE_INFINITY

  for (const candidate of candidates) {
    const distance = editDistance(unknownName, candidate)

    if (distance < bestDistance) {
      bestDistance = distance
      bestName = candidate
    }
  }

  if (bestName === undefined) {
    return undefined
  }

  return bestDistance <= 2 ? bestName : undefined
}

function assignValue(
  target: Record<string, unknown>,
  spec: ParsedOptionSpec,
  value: unknown,
): void {
  target[spec.key] = value
}

/**
 * Parses option tokens into resolved values and leftover positional tokens.
 */
export function parseOptionTokens(
  tokens: readonly string[],
  optionSpecs: ParsedOptionSpec[],
  stopAtFirstPositional: boolean,
): { values: Record<string, unknown>; rest: string[] } {
  const values = createDefaults(optionSpecs)
  const rest: string[] = []

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]

    if (token === undefined) {
      break
    }

    if (token === "--") {
      rest.push(...tokens.slice(index + 1))
      break
    }

    if (!token.startsWith("-") || token === "-") {
      if (stopAtFirstPositional) {
        rest.push(...tokens.slice(index))
        break
      }

      rest.push(token)
      continue
    }

    if (token.startsWith("--")) {
      const { name, value } = normalizeLongToken(token)
      const normalizedName = name.startsWith("no-") ? name.slice(3) : name
      const spec =
        findOptionByLongName(optionSpecs, normalizedName) ?? findOptionByLongName(optionSpecs, name)

      if (!spec) {
        const closest = findClosestLongOptionName(optionSpecs, normalizedName)
        throw new CliInputError(
          `Unknown option: ${token}`,
          "Run --help to see all available options",
          closest ? `Did you mean --${closest}?` : undefined,
        )
      }

      if (name.startsWith("no-") && !spec.expectsValue) {
        assignValue(values, spec, false)
        continue
      }

      if (spec.expectsValue) {
        const nextValue = value ?? tokens[index + 1]

        if (nextValue === undefined || nextValue.startsWith("-")) {
          throw new CliInputError(
            `Missing value for option: ${token}`,
            "Provide a value like --option <value> and try again",
          )
        }

        assignValue(values, spec, nextValue)

        if (value === undefined) {
          index += 1
        }

        continue
      }

      assignValue(values, spec, true)
      continue
    }

    const cluster = normalizeShortCluster(token)

    for (let clusterIndex = 0; clusterIndex < cluster.length; clusterIndex += 1) {
      const shortName = cluster[clusterIndex]

      if (shortName === undefined) {
        break
      }

      const spec = findOptionByShortName(optionSpecs, shortName)

      if (!spec) {
        throw new CliInputError(
          `Unknown option: -${shortName}`,
          "Run --help to see all available options",
        )
      }

      if (spec.expectsValue) {
        const inlineValue = cluster.slice(clusterIndex + 1).join("")
        const nextValue = inlineValue.length > 0 ? inlineValue : tokens[index + 1]

        if (nextValue === undefined || nextValue.startsWith("-")) {
          throw new CliInputError(
            `Missing value for option: -${shortName}`,
            "Provide a value like -x <value> and try again",
          )
        }

        assignValue(values, spec, nextValue)

        if (inlineValue.length === 0) {
          index += 1
        }

        break
      }

      assignValue(values, spec, true)
    }
  }

  return { values, rest }
}

/**
 * Parses positional tokens into structured arguments.
 */
export function parsePositionals(
  arguments_: ParsedArgumentSpec[],
  tokens: readonly string[],
): { positionals: Record<string, string | string[] | undefined>; args: string[] } {
  const positionals: Record<string, string | string[] | undefined> = {}
  const args: string[] = []
  let tokenIndex = 0

  for (const argument of arguments_) {
    if (argument.variadic) {
      const remaining = tokens.slice(tokenIndex)
      positionals[argument.key] = [...remaining]
      args.push(...remaining)
      tokenIndex = tokens.length
      break
    }

    const value = tokens[tokenIndex]

    if (value === undefined) {
      if (argument.required) {
        throw new CliInputError(
          `Missing required argument: <${argument.key}>`,
          "Run --help to see required arguments for this command",
        )
      }

      positionals[argument.key] = undefined
      continue
    }

    positionals[argument.key] = value
    args.push(value)
    tokenIndex += 1
  }

  if (tokenIndex < tokens.length) {
    throw new CliInputError(
      `Unexpected arguments: ${tokens.slice(tokenIndex).join(" ")}`,
      "Run --help to review supported arguments and options",
    )
  }

  return { positionals, args }
}
