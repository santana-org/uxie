import { readFileSync } from "node:fs"

export interface PackageMetadata {
  name?: string | undefined
  description?: string | undefined
}

export interface PackageBrandDefaults {
  title: string
  tagline: string
  badge: string
}

function readPackageMetadata(): PackageMetadata {
  try {
    const raw = readFileSync(new URL("../../package.json", import.meta.url), "utf8")
    return JSON.parse(raw) as PackageMetadata
  } catch {
    return {}
  }
}

/**
 * Reads the package metadata and turns it into branding defaults.
 */
export function getPackageBrandDefaults(): PackageBrandDefaults {
  const metadata = readPackageMetadata()
  const packageName = metadata.name ?? ""
  const packageLeafName = packageName.includes("/")
    ? packageName.slice(packageName.lastIndexOf("/") + 1)
    : packageName

  return {
    title: packageName,
    tagline: metadata.description ?? packageName,
    badge: packageLeafName.toUpperCase(),
  }
}
