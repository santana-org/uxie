import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { FileOptions } from "../types.js"

export class SystemProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random file name
   */
  fileName(options: FileOptions = {}): string {
    const { extension } = options
    const name = this.random.pick(this.locale.lorem.words)
    const ext = extension ?? this.random.pick(this.locale.system.fileExtension)

    return `${name}.${ext}`
  }

  /**
   * Generate a random common file name
   */
  commonFileName(options: { extension?: string } = {}): string {
    const commonNames = [
      "document",
      "report",
      "data",
      "file",
      "backup",
      "archive",
      "notes",
      "readme",
      "config",
      "settings",
      "log",
      "output",
      "input",
      "temp",
    ]

    const name = this.random.pick(commonNames)
    const ext = options.extension ?? this.random.pick(["txt", "pdf", "doc", "docx", "xlsx", "json"])

    return `${name}.${ext}`
  }

  /**
   * Generate a random file extension
   */
  fileExtension(): string {
    return this.random.pick(this.locale.system.fileExtension)
  }

  /**
   * Generate a random common file extension
   */
  commonFileExtension(): string {
    const common = [
      "txt",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "jpg",
      "png",
      "gif",
      "mp3",
      "mp4",
      "zip",
    ]
    return this.random.pick(common)
  }

  /**
   * Generate a random file path
   */
  filePath(options: FileOptions = {}): string {
    const { depth = 3 } = options
    const parts: string[] = []

    const dirs = [
      "home",
      "user",
      "documents",
      "downloads",
      "projects",
      "src",
      "lib",
      "data",
      "tmp",
      "var",
      "etc",
    ]

    for (let i = 0; i < depth; i++) {
      parts.push(this.random.pick(dirs))
    }

    parts.push(this.fileName(options))

    return `/${parts.join("/")}`
  }

  /**
   * Generate a random directory path
   */
  directoryPath(options: { depth?: number } = {}): string {
    const { depth = 3 } = options
    const dirs = [
      "home",
      "user",
      "documents",
      "downloads",
      "projects",
      "src",
      "lib",
      "data",
      "tmp",
      "var",
      "etc",
    ]

    const parts: string[] = []
    for (let i = 0; i < depth; i++) {
      parts.push(this.random.pick(dirs))
    }

    return `/${parts.join("/")}`
  }

  /**
   * Generate a random MIME type
   */
  mimeType(): string {
    return this.random.pick(this.locale.system.mimeType)
  }

  /**
   * Generate a random common MIME type
   */
  commonMimeType(): string {
    const common = [
      "application/json",
      "application/pdf",
      "text/plain",
      "text/html",
      "image/jpeg",
      "image/png",
      "image/gif",
      "audio/mpeg",
      "video/mp4",
    ]
    return this.random.pick(common)
  }

  /**
   * Generate a random file type
   */
  fileType(): string {
    const types = ["image", "video", "audio", "text", "application", "font", "model", "message"]
    return this.random.pick(types)
  }

  /**
   * Generate a random semantic version
   */
  semver(options: { allowPrerelease?: boolean } = {}): string {
    const { allowPrerelease = false } = options
    const major = this.random.int(0, 10)
    const minor = this.random.int(0, 20)
    const patch = this.random.int(0, 30)

    let version = `${major}.${minor}.${patch}`

    if (allowPrerelease && this.random.boolean(0.3)) {
      const prerelease = this.random.pick(["alpha", "beta", "rc"])
      const prereleaseNum = this.random.int(1, 10)
      version += `-${prerelease}.${prereleaseNum}`
    }

    return version
  }

  /**
   * Generate a random network port
   */
  port(): number {
    return this.random.int(1, 65535)
  }

  /**
   * Generate a random common network port
   */
  commonPort(): number {
    const ports = [
      20, 21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 5432, 6379, 8080, 8443,
      27017,
    ]
    return this.random.pick(ports)
  }

  /**
   * Generate a random cron expression
   */
  cron(options: { includeYear?: boolean; includeNonStandard?: boolean } = {}): string {
    const { includeYear = false, includeNonStandard = false } = options

    const minute = this.random.boolean(0.3) ? "*" : String(this.random.int(0, 59))
    const hour = this.random.boolean(0.3) ? "*" : String(this.random.int(0, 23))
    const dayOfMonth = this.random.boolean(0.3) ? "*" : String(this.random.int(1, 31))
    const month = this.random.boolean(0.3) ? "*" : String(this.random.int(1, 12))
    const dayOfWeek = this.random.boolean(0.3) ? "*" : String(this.random.int(0, 6))

    let cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`

    if (includeNonStandard && this.random.boolean(0.2)) {
      const nonStandard = ["@yearly", "@monthly", "@weekly", "@daily", "@hourly", "@reboot"]
      return this.random.pick(nonStandard)
    }

    if (includeYear) {
      const year = this.random.boolean(0.3) ? "*" : String(this.random.int(2020, 2030))
      cron += ` ${year}`
    }

    return cron
  }

  /**
   * Generate a random database column name
   */
  databaseColumn(): string {
    return this.random.pick(this.locale.database.column)
  }

  /**
   * Generate a random database type
   */
  databaseType(): string {
    return this.random.pick(this.locale.database.type)
  }

  /**
   * Generate a random database engine
   */
  databaseEngine(): string {
    return this.random.pick(this.locale.database.engine)
  }

  /**
   * Generate a random git branch name
   */
  gitBranch(): string {
    const type = this.random.pick(this.locale.git.branch)
    const word = this.random.pick(this.locale.lorem.words)
    const number = this.random.int(1, 999)

    const patterns = [
      `${type}/${word}`,
      `${type}/${word}-${number}`,
      `${type}/${word}_${number}`,
      word,
    ]

    return this.random.pick(patterns)
  }

  /**
   * Generate a random git commit SHA
   */
  gitCommitSha(options: { short?: boolean } = {}): string {
    const { short = false } = options
    const chars = "0123456789abcdef"
    const length = short ? 7 : 40
    let sha = ""

    for (let i = 0; i < length; i++) {
      sha += chars.charAt(this.random.int(0, 15))
    }

    return sha
  }

  /**
   * Generate a random git commit message
   */
  gitCommitMessage(): string {
    const type = this.random.pick(this.locale.git.commitType)
    const scope = this.random.boolean(0.5) ? `(${this.random.pick(this.locale.lorem.words)})` : ""
    const subject = this.random
      .pickMultiple(this.locale.lorem.words, this.random.int(3, 8))
      .join(" ")

    return `${type}${scope}: ${subject}`
  }
}
