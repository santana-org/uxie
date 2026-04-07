import { cyan, dim, gray, magenta } from "@santana-org/colors"
import type { CliBranding } from "../types.js"
import { getPackageBrandDefaults } from "../shared/package-branding.js"

export interface ResolvedCliBranding {
  title: string
  tagline: string
  badge: string
}

function identity(value: string): string {
  return value
}

/**
 * Resolves the effective branding for the CLI header.
 */
export function resolveBranding(branding?: CliBranding): ResolvedCliBranding {
  const defaults = getPackageBrandDefaults()

  return {
    title: branding?.title ?? defaults.title,
    tagline: branding?.tagline ?? defaults.tagline,
    badge: branding?.badge ?? defaults.badge,
  }
}

/**
 * Builds the colored header used at the top of the help output.
 */
export function buildBrandHeader(branding?: CliBranding, colorsEnabled = true): string[] {
  const resolved = resolveBranding(branding)

  const stylize = colorsEnabled
    ? { pipe: magenta, title: cyan, tagline: gray, badge: dim }
    : { pipe: identity, title: identity, tagline: identity, badge: identity }

  const pipe = stylize.pipe("│")

  return [
    "",
    `${pipe}  ${stylize.title(resolved.title)}`,
    `${pipe}  ${stylize.tagline(resolved.tagline)}  ${stylize.badge(`[ ${resolved.badge} ]`)}`,
    "",
  ]
}

/**
 * Creates a header factory bound to a fixed color mode.
 */
export function createBrandHeader(colorsEnabled: boolean) {
  return (branding?: CliBranding): string[] => buildBrandHeader(branding, colorsEnabled)
}
