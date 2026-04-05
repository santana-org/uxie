import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type {
  EmailOptions,
  IpOptions,
  MacOptions,
  PasswordOptions,
  UrlOptions,
  UserAgentOptions,
  UsernameOptions,
} from "../types.js"

/**
 * Generates internet-related identifiers, URLs, and network values.
 */
export class InternetProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random email address
   */
  email(options: EmailOptions = {}): string {
    const { firstName, lastName, domain, allowSpecialCharacters = false } = options

    const first =
      firstName ??
      this.random.pick(this.locale.person.firstNameMale.concat(this.locale.person.firstNameFemale))
    const last = lastName ?? this.random.pick(this.locale.person.lastName)

    const cleanFirst = first.toLowerCase().replace(/[^a-z]/gi, "")
    const cleanLast = last.toLowerCase().replace(/[^a-z]/gi, "")

    const separators = allowSpecialCharacters ? [".", "_", "-", "+", ""] : [".", "_", ""]
    const separator = this.random.pick(separators)
    const number = this.random.boolean(0.4) ? String(this.random.int(1, 999)) : ""

    const emailDomain = domain ?? this.random.pick(this.locale.internet.emailProviders)

    return `${cleanFirst}${separator}${cleanLast}${number}@${emailDomain}`
  }

  /**
   * Generate a random example email (safe for testing)
   */
  exampleEmail(options: EmailOptions = {}): string {
    const exampleDomains = ["example.com", "example.org", "example.net", "test.com", "test.org"]
    return this.email({ ...options, domain: this.random.pick(exampleDomains) })
  }

  /**
   * Generate a random username
   */
  username(options: UsernameOptions = {}): string {
    const {
      firstName,
      lastName,
      includeNumbers = true,
      includeSpecialChars = false,
      minLength = 6,
      maxLength = 20,
    } = options

    const first =
      firstName ??
      this.random.pick(this.locale.person.firstNameMale.concat(this.locale.person.firstNameFemale))
    const last = lastName ?? this.random.pick(this.locale.person.lastName)

    const cleanFirst = first.toLowerCase().replace(/[^a-z]/gi, "")
    const cleanLast = last.toLowerCase().replace(/[^a-z]/gi, "")

    const patterns = [
      `${cleanFirst}${cleanLast}`,
      `${cleanFirst}_${cleanLast}`,
      `${cleanFirst}.${cleanLast}`,
      `${cleanFirst}${cleanLast.charAt(0)}`,
      `${cleanFirst.charAt(0)}${cleanLast}`,
    ]

    let username = this.random.pick(patterns)

    if (includeNumbers) {
      username += String(this.random.int(1, 9999))
    }

    if (includeSpecialChars && this.random.boolean(0.3)) {
      username += this.random.pick(["_", "-", "."])
    }

    if (username.length < minLength) {
      username += String(this.random.int(10, 999))
    }

    if (username.length > maxLength) {
      username = username.substring(0, maxLength)
    }

    return username.toLowerCase()
  }

  /**
   * Generate a random display name
   */
  displayName(options: { firstName?: string; lastName?: string } = {}): string {
    const firstName =
      options.firstName ??
      this.random.pick(this.locale.person.firstNameMale.concat(this.locale.person.firstNameFemale))
    const lastName = options.lastName ?? this.random.pick(this.locale.person.lastName)

    const patterns = [
      `${firstName} ${lastName}`,
      `${firstName}${lastName}`,
      `${firstName}_${lastName}`,
      `${firstName}.${lastName}`,
      firstName,
      `${firstName} ${lastName.charAt(0)}.`,
    ]

    return this.random.pick(patterns)
  }

  /**
   * Generate a random password
   */
  password(options: PasswordOptions = {}): string {
    const {
      length = 16,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true,
      charset,
      excludeAmbiguous = false,
    } = options

    let chars = ""

    if (charset) {
      chars = charset
    } else {
      const lowercaseChars = excludeAmbiguous
        ? "abcdefghjkmnpqrstuvwxyz"
        : "abcdefghijklmnopqrstuvwxyz"
      const uppercaseChars = excludeAmbiguous
        ? "ABCDEFGHJKMNPQRSTUVWXYZ"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const numberChars = excludeAmbiguous ? "23456789" : "0123456789"
      const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

      if (lowercase) chars += lowercaseChars
      if (uppercase) chars += uppercaseChars
      if (numbers) chars += numberChars
      if (symbols) chars += symbolChars
    }

    if (chars.length === 0) {
      chars = "abcdefghijklmnopqrstuvwxyz"
    }

    let password = ""
    for (let i = 0; i < length; i++) {
      password += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return password
  }

  /**
   * Generate a random domain name
   */
  domainName(): string {
    const word = this.random.pick(this.locale.lorem.words).toLowerCase()
    const suffix = this.random.pick(this.locale.internet.domainSuffixes)
    return `${word}${suffix}`
  }

  /**
   * Generate a random domain word
   */
  domainWord(): string {
    return this.random.pick(this.locale.lorem.words).toLowerCase()
  }

  /**
   * Generate a random domain suffix
   */
  domainSuffix(): string {
    return this.random.pick(this.locale.internet.domainSuffixes)
  }

  /**
   * Generate a random URL
   */
  url(options: UrlOptions = {}): string {
    const {
      protocol = "https",
      includePath = true,
      includeQueryString = false,
      includeFragment = false,
    } = options

    let url = `${protocol}://${this.domainName()}`

    if (includePath) {
      const pathSegments = this.random.int(1, 4)
      for (let i = 0; i < pathSegments; i++) {
        url += `/${this.random.pick(this.locale.lorem.words)}`
      }
    }

    if (includeQueryString) {
      const params = this.random.int(1, 3)
      url += "?"
      const queryParts: string[] = []
      for (let i = 0; i < params; i++) {
        const key = this.random.pick(this.locale.lorem.words)
        const value = this.random.pick(this.locale.lorem.words)
        queryParts.push(`${key}=${value}`)
      }
      url += queryParts.join("&")
    }

    if (includeFragment) {
      url += `#${this.random.pick(this.locale.lorem.words)}`
    }

    return url
  }

  /**
   * Generate a random HTTP method
   */
  httpMethod(): string {
    return this.random.pick(this.locale.internet.httpMethods)
  }

  /**
   * Generate a random HTTP status code
   */
  httpStatusCode(
    options: {
      type?: "informational" | "success" | "redirect" | "client_error" | "server_error"
    } = {},
  ): number {
    const statusCodes = {
      informational: [100, 101, 102, 103],
      success: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226],
      redirect: [300, 301, 302, 303, 304, 305, 307, 308],
      client_error: [
        400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417,
        418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
      ],
      server_error: [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511],
    }

    if (options.type) {
      return this.random.pick(statusCodes[options.type])
    }

    const allCodes = Object.values(statusCodes).flat()
    return this.random.pick(allCodes)
  }

  /**
   * Generate a random IPv4 address
   */
  ipv4(): string {
    return `${this.random.int(1, 255)}.${this.random.int(0, 255)}.${this.random.int(0, 255)}.${this.random.int(1, 254)}`
  }

  /**
   * Generate a random IPv6 address
   */
  ipv6(): string {
    const segments: string[] = []
    for (let i = 0; i < 8; i++) {
      segments.push(this.random.int(0, 65535).toString(16).padStart(4, "0"))
    }
    return segments.join(":")
  }

  /**
   * Generate a random IP address
   */
  ip(options: IpOptions = {}): string {
    const { version = 4 } = options
    return version === 4 ? this.ipv4() : this.ipv6()
  }

  /**
   * Generate a random MAC address
   */
  mac(options: MacOptions = {}): string {
    const { separator = ":" } = options
    const segments: string[] = []
    for (let i = 0; i < 6; i++) {
      segments.push(this.random.int(0, 255).toString(16).padStart(2, "0").toUpperCase())
    }
    return segments.join(separator)
  }

  /**
   * Generate a random port number
   */
  port(): number {
    return this.random.int(1, 65535)
  }

  /**
   * Generate a random user agent string
   */
  userAgent(options: UserAgentOptions = {}): string {
    const { browser } = options
    const browsers = ["chrome", "firefox", "safari", "edge", "opera"] as const

    const selectedBrowser = browser ?? this.random.pick([...browsers])
    const agents = this.locale.internet.userAgents[selectedBrowser]

    return this.random.pick(agents)
  }

  /**
   * Generate a random emoji
   */
  emoji(): string {
    const emojis = [
      "😀",
      "😁",
      "😂",
      "🤣",
      "😃",
      "😄",
      "😅",
      "😆",
      "😉",
      "😊",
      "😋",
      "😎",
      "😍",
      "😘",
      "🥰",
      "😗",
      "😙",
      "🥲",
      "😚",
      "☺️",
      "🙂",
      "🤗",
      "🤩",
      "🤔",
      "🤨",
      "😐",
      "😑",
      "😶",
      "🙄",
      "😏",
      "😣",
      "😥",
      "😮",
      "🤐",
      "😯",
      "😪",
      "😫",
      "🥱",
      "😴",
      "😌",
      "😛",
      "😜",
      "😝",
      "🤤",
      "😒",
      "😓",
      "😔",
      "😕",
      "🙃",
      "🤑",
      "😲",
      "☹️",
      "🙁",
      "😖",
      "😞",
      "😟",
      "😤",
      "😢",
      "😭",
      "😦",
      "😧",
      "😨",
      "😩",
      "🤯",
      "😬",
      "😰",
      "😱",
      "🥵",
      "🥶",
      "😳",
      "🤪",
      "😵",
      "🥴",
      "😠",
      "😡",
      "🤬",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
      "😇",
      "🥳",
      "🥺",
      "🤠",
      "🤡",
      "🤥",
      "🤫",
      "🤭",
      "🧐",
      "🤓",
      "👍",
      "👎",
      "👏",
      "🙌",
      "🤝",
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "⭐",
      "🌟",
      "✨",
      "💫",
      "🔥",
      "💯",
      "🎉",
      "🎊",
    ]
    return this.random.pick(emojis)
  }

  /**
   * Generate a random avatar URL
   */
  avatar(): string {
    const id = this.random.int(1, 1000)
    const services = [
      `https://i.pravatar.cc/300?u=${id}`,
      `https://avatars.dicebear.com/api/identicon/${id}.svg`,
      `https://robohash.org/${id}?set=set4`,
    ]
    return this.random.pick(services)
  }

  /**
   * Generate a random JWT token (fake, not valid)
   */
  jwt(): string {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
    const payload = Buffer.from(
      JSON.stringify({
        sub: String(this.random.int(1, 999999)),
        name: this.random.pick(this.locale.person.firstNameMale),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url")
    const signature = this.password({
      length: 43,
      symbols: false,
      uppercase: true,
      lowercase: true,
      numbers: true,
    })

    return `${header}.${payload}.${signature}`
  }

  /**
   * Generate a random protocol
   */
  protocol(): string {
    return this.random.pick(this.locale.internet.protocols)
  }

  /**
   * Generate a random slug
   */
  slug(options: { wordCount?: number } = {}): string {
    const { wordCount = 3 } = options
    const words = this.random.pickMultiple(this.locale.lorem.words, wordCount)
    return words.join("-").toLowerCase()
  }
}
