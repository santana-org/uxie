import { beforeEach, describe, expect, it } from "vitest"
import { Faker, createFaker, faker } from "../faker.js"

describe("Faker", () => {
  describe("instance creation", () => {
    it("should create a default faker instance", () => {
      expect(faker).toBeInstanceOf(Faker)
    })

    it("should create a custom faker with createFaker", () => {
      const customFaker = createFaker({ locale: "es" })
      expect(customFaker).toBeInstanceOf(Faker)
      expect(customFaker.getLocale()).toBe("es")
    })

    it("should create a faker with a seed", () => {
      const seededFaker = createFaker({ seed: 12345 })
      expect(seededFaker).toBeInstanceOf(Faker)
    })
  })

  describe("seed reproducibility", () => {
    it("should generate the same values with the same seed", () => {
      const faker1 = createFaker({ seed: 42 })
      const faker2 = createFaker({ seed: 42 })

      const name1 = faker1.person.firstName()
      const name2 = faker2.person.firstName()

      expect(name1).toBe(name2)
    })

    it("should generate different values with different seeds", () => {
      const faker1 = createFaker({ seed: 42 })
      const faker2 = createFaker({ seed: 999 })

      const results1: string[] = []
      const results2: string[] = []

      for (let i = 0; i < 10; i++) {
        results1.push(faker1.person.firstName())
        results2.push(faker2.person.firstName())
      }

      expect(results1).not.toEqual(results2)
    })

    it("should allow resetting the seed", () => {
      const seededFaker = createFaker({ seed: 42 })
      const firstName1 = seededFaker.person.firstName()
      const lastName1 = seededFaker.person.lastName()

      seededFaker.seed(42)
      const firstName2 = seededFaker.person.firstName()
      const lastName2 = seededFaker.person.lastName()

      expect(firstName1).toBe(firstName2)
      expect(lastName1).toBe(lastName2)
    })
  })

  describe("locale switching", () => {
    it("should switch locales", () => {
      const customFaker = createFaker({ locale: "en" })
      expect(customFaker.getLocale()).toBe("en")

      customFaker.setLocale("es")
      expect(customFaker.getLocale()).toBe("es")
    })

    it("should return available locales", () => {
      const locales = faker.getAvailableLocales()
      expect(locales).toContain("en")
      expect(locales).toContain("es")
    })
  })

  describe("person provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate first names", () => {
      const name = testFaker.person.firstName()
      expect(typeof name).toBe("string")
      expect(name.length).toBeGreaterThan(0)
    })

    it("should generate last names", () => {
      const name = testFaker.person.lastName()
      expect(typeof name).toBe("string")
      expect(name.length).toBeGreaterThan(0)
    })

    it("should generate full names", () => {
      const name = testFaker.person.fullName()
      expect(typeof name).toBe("string")
      expect(name.split(" ").length).toBeGreaterThanOrEqual(2)
    })

    it("should generate full names with options", () => {
      const name = testFaker.person.fullName({
        prefix: true,
        middleName: true,
        suffix: true,
      })
      expect(name.split(" ").length).toBeGreaterThanOrEqual(4)
    })

    it("should generate gendered names", () => {
      const maleName = testFaker.person.firstName({ gender: "male" })
      const femaleName = testFaker.person.firstName({ gender: "female" })
      expect(typeof maleName).toBe("string")
      expect(typeof femaleName).toBe("string")
    })

    it("should generate job titles", () => {
      const job = testFaker.person.jobTitle()
      expect(typeof job).toBe("string")
    })

    it("should generate ages within range", () => {
      const age = testFaker.person.age({ min: 20, max: 30 })
      expect(age).toBeGreaterThanOrEqual(20)
      expect(age).toBeLessThanOrEqual(30)
    })

    it("should generate birth dates", () => {
      const birthDate = testFaker.person.birthDate()
      expect(birthDate).toBeInstanceOf(Date)
    })

    it("should generate complete person profiles", () => {
      const person = testFaker.person.person()

      expect(person.firstName).toBeDefined()
      expect(person.lastName).toBeDefined()
      expect(person.fullName).toBeDefined()
      expect(person.email).toBeDefined()
      expect(person.phone).toBeDefined()
      expect(person.username).toBeDefined()
      expect(person.avatar).toBeDefined()
      expect(person.age).toBeDefined()
      expect(person.birthDate).toBeInstanceOf(Date)
    })
  })

  describe("internet provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate emails", () => {
      const email = testFaker.internet.email()
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    it("should generate emails with custom domain", () => {
      const email = testFaker.internet.email({ domain: "test.com" })
      expect(email).toContain("@test.com")
    })

    it("should generate usernames", () => {
      const username = testFaker.internet.username()
      expect(typeof username).toBe("string")
      expect(username.length).toBeGreaterThan(0)
    })

    it("should generate passwords", () => {
      const password = testFaker.internet.password({ length: 20 })
      expect(password).toHaveLength(20)
    })

    it("should generate URLs", () => {
      const url = testFaker.internet.url()
      expect(url).toMatch(/^https?:\/\//)
    })

    it("should generate IPv4 addresses", () => {
      const ip = testFaker.internet.ipv4()
      expect(ip).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
    })

    it("should generate IPv6 addresses", () => {
      const ip = testFaker.internet.ipv6()
      expect(ip).toMatch(/^[0-9a-f:]+$/i)
    })

    it("should generate MAC addresses", () => {
      const mac = testFaker.internet.mac()
      expect(mac).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i)
    })

    it("should generate HTTP status codes", () => {
      const status = testFaker.internet.httpStatusCode()
      expect(status).toBeGreaterThanOrEqual(100)
      expect(status).toBeLessThanOrEqual(599)
    })
  })

  describe("location provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate cities", () => {
      const city = testFaker.location.city()
      expect(typeof city).toBe("string")
    })

    it("should generate states", () => {
      const state = testFaker.location.state()
      expect(typeof state).toBe("string")
    })

    it("should generate zip codes", () => {
      const zip = testFaker.location.zipCode()
      expect(zip).toMatch(/^\d+(-\d+)?$/)
    })

    it("should generate coordinates", () => {
      const coords = testFaker.location.coordinates()
      expect(coords.latitude).toBeGreaterThanOrEqual(-90)
      expect(coords.latitude).toBeLessThanOrEqual(90)
      expect(coords.longitude).toBeGreaterThanOrEqual(-180)
      expect(coords.longitude).toBeLessThanOrEqual(180)
    })

    it("should generate full addresses", () => {
      const address = testFaker.location.address()
      expect(address.street).toBeDefined()
      expect(address.city).toBeDefined()
      expect(address.state).toBeDefined()
      expect(address.zipCode).toBeDefined()
      expect(address.country).toBeDefined()
    })
  })

  describe("lorem provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate words", () => {
      const word = testFaker.lorem.word()
      expect(typeof word).toBe("string")
    })

    it("should generate sentences", () => {
      const sentence = testFaker.lorem.sentence()
      expect(sentence).toMatch(/^[A-Z].*\.$/)
    })

    it("should generate paragraphs", () => {
      const paragraph = testFaker.lorem.paragraph()
      expect(paragraph.length).toBeGreaterThan(50)
    })
  })

  describe("finance provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate credit card numbers", () => {
      const ccn = testFaker.finance.creditCardNumber()
      expect(ccn.length).toBeGreaterThanOrEqual(14)
      expect(ccn).toMatch(/^\d+$/)
    })

    it("should generate valid Visa numbers", () => {
      const visa = testFaker.finance.creditCardNumber({ type: "visa" })
      expect(visa.startsWith("4")).toBe(true)
    })

    it("should generate credit card CVV", () => {
      const cvv = testFaker.finance.creditCardCvv()
      expect(cvv).toMatch(/^\d{3}$/)
    })

    it("should generate IBAN", () => {
      const iban = testFaker.finance.iban()
      expect(iban.length).toBeGreaterThanOrEqual(15)
    })

    it("should generate BIC codes", () => {
      const bic = testFaker.finance.bic()
      expect(bic.length).toBeGreaterThanOrEqual(8)
    })

    it("should generate Bitcoin addresses", () => {
      const btc = testFaker.finance.bitcoinAddress()
      expect(typeof btc).toBe("string")
    })

    it("should generate Ethereum addresses", () => {
      const eth = testFaker.finance.ethereumAddress()
      expect(eth.startsWith("0x")).toBe(true)
    })
  })

  describe("number provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate integers", () => {
      const int = testFaker.number.int({ min: 10, max: 20 })
      expect(int).toBeGreaterThanOrEqual(10)
      expect(int).toBeLessThanOrEqual(20)
    })

    it("should generate floats", () => {
      const float = testFaker.number.float({ min: 0, max: 1, precision: 2 })
      expect(float).toBeGreaterThanOrEqual(0)
      expect(float).toBeLessThanOrEqual(1)
    })

    it("should generate UUIDs", () => {
      const uuid = testFaker.number.uuid()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it("should generate booleans", () => {
      const bool = testFaker.number.boolean()
      expect(typeof bool).toBe("boolean")
    })

    it("should generate hex strings", () => {
      const hex = testFaker.number.hex({ length: 8 })
      expect(hex).toMatch(/^0x[0-9a-f]{8}$/i)
    })
  })

  describe("date provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate past dates", () => {
      const pastDate = testFaker.date.past()
      expect(pastDate).toBeInstanceOf(Date)
      expect(pastDate.getTime()).toBeLessThan(Date.now())
    })

    it("should generate future dates", () => {
      const futureDate = testFaker.date.future()
      expect(futureDate).toBeInstanceOf(Date)
      expect(futureDate.getTime()).toBeGreaterThan(Date.now())
    })

    it("should generate dates between range", () => {
      const min = new Date("2020-01-01")
      const max = new Date("2023-12-31")
      const date = testFaker.date.between({ min, max })
      expect(date.getTime()).toBeGreaterThanOrEqual(min.getTime())
      expect(date.getTime()).toBeLessThanOrEqual(max.getTime())
    })

    it("should generate months", () => {
      const month = testFaker.date.month()
      expect(typeof month).toBe("string")
    })

    it("should generate weekdays", () => {
      const weekday = testFaker.date.weekday()
      expect(typeof weekday).toBe("string")
    })
  })

  describe("color provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate hex colors", () => {
      const hex = testFaker.color.hex()
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it("should generate RGB colors", () => {
      const rgb = testFaker.color.rgb({ format: "css" }) as string
      expect(rgb).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
    })

    it("should generate HSL colors", () => {
      const hsl = testFaker.color.hsl({ format: "css" }) as string
      expect(hsl).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/)
    })

    it("should generate color names", () => {
      const name = testFaker.color.name()
      expect(typeof name).toBe("string")
    })
  })

  describe("commerce provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate product names", () => {
      const product = testFaker.commerce.productName()
      expect(product.split(" ").length).toBeGreaterThanOrEqual(2)
    })

    it("should generate prices", () => {
      const price = testFaker.commerce.price()
      expect(price).toMatch(/^\$\d+\.\d{2}$/)
    })

    it("should generate EAN-13 barcodes", () => {
      const ean = testFaker.commerce.ean13()
      expect(ean).toHaveLength(13)
    })

    it("should generate ISBN-13", () => {
      const isbn = testFaker.commerce.isbn13()
      expect(isbn).toHaveLength(13)
      expect(isbn.startsWith("978") || isbn.startsWith("979")).toBe(true)
    })
  })

  describe("vehicle provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate manufacturers", () => {
      const manufacturer = testFaker.vehicle.manufacturer()
      expect(typeof manufacturer).toBe("string")
    })

    it("should generate VINs", () => {
      const vin = testFaker.vehicle.vin()
      expect(vin).toHaveLength(17)
    })

    it("should generate license plates", () => {
      const plate = testFaker.vehicle.licensePlate()
      expect(typeof plate).toBe("string")
    })

    it("should generate complete vehicles", () => {
      const vehicle = testFaker.vehicle.vehicle()
      expect(vehicle.manufacturer).toBeDefined()
      expect(vehicle.model).toBeDefined()
      expect(vehicle.type).toBeDefined()
      expect(vehicle.vin).toBeDefined()
    })
  })

  describe("system provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate file names", () => {
      const fileName = testFaker.system.fileName()
      expect(fileName).toMatch(/\.\w+$/)
    })

    it("should generate file paths", () => {
      const filePath = testFaker.system.filePath()
      expect(filePath).toMatch(/^\//)
    })

    it("should generate MIME types", () => {
      const mimeType = testFaker.system.mimeType()
      expect(mimeType).toMatch(/\w+\/\w+/)
    })

    it("should generate semver versions", () => {
      const semver = testFaker.system.semver()
      expect(semver).toMatch(/^\d+\.\d+\.\d+/)
    })

    it("should generate git commit SHAs", () => {
      const sha = testFaker.system.gitCommitSha()
      expect(sha).toHaveLength(40)
    })

    it("should generate git commit messages", () => {
      const message = testFaker.system.gitCommitMessage()
      expect(message).toMatch(/^\w+(\(\w+\))?:/)
    })
  })

  describe("phone provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate phone numbers", () => {
      const phone = testFaker.phone.number()
      expect(typeof phone).toBe("string")
    })

    it("should generate E.164 phone numbers", () => {
      const phone = testFaker.phone.e164()
      expect(phone).toMatch(/^\+\d+$/)
    })

    it("should generate IMEI numbers", () => {
      const imei = testFaker.phone.imei()
      expect(imei).toHaveLength(15)
    })
  })

  describe("hacker provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate hacker phrases", () => {
      const phrase = testFaker.hacker.phrase()
      expect(typeof phrase).toBe("string")
      expect(phrase.length).toBeGreaterThan(10)
    })
  })

  describe("food provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate dishes", () => {
      const dish = testFaker.food.dish()
      expect(typeof dish).toBe("string")
    })

    it("should generate fruits", () => {
      const fruit = testFaker.food.fruit()
      expect(typeof fruit).toBe("string")
    })

    it("should generate vegetables", () => {
      const vegetable = testFaker.food.vegetable()
      expect(typeof vegetable).toBe("string")
    })
  })

  describe("animal provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate dog breeds", () => {
      const dog = testFaker.animal.dog()
      expect(typeof dog).toBe("string")
    })

    it("should generate cat types", () => {
      const cat = testFaker.animal.cat()
      expect(typeof cat).toBe("string")
    })

    it("should generate random animals", () => {
      const animal = testFaker.animal.animal()
      expect(typeof animal).toBe("string")
    })
  })

  describe("music provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate music genres", () => {
      const genre = testFaker.music.genre()
      expect(typeof genre).toBe("string")
    })

    it("should generate song names", () => {
      const song = testFaker.music.songName()
      expect(typeof song).toBe("string")
    })
  })

  describe("string provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate alphanumeric strings", () => {
      const str = testFaker.string.alphanumeric({ length: 10 })
      expect(str).toHaveLength(10)
      expect(str).toMatch(/^[a-zA-Z0-9]+$/)
    })

    it("should generate alpha strings", () => {
      const str = testFaker.string.alpha({ length: 10 })
      expect(str).toHaveLength(10)
      expect(str).toMatch(/^[a-zA-Z]+$/)
    })

    it("should generate numeric strings", () => {
      const str = testFaker.string.numeric({ length: 10 })
      expect(str).toHaveLength(10)
      expect(str).toMatch(/^\d+$/)
    })

    it("should generate strings from patterns", () => {
      const str = testFaker.string.fromPattern("???-####")
      expect(str).toMatch(/^[A-Z]{3}-\d{4}$/)
    })

    it("should generate nanoids", () => {
      const nanoid = testFaker.string.nanoid()
      expect(nanoid).toHaveLength(21)
    })
  })

  describe("image provider", () => {
    let testFaker: Faker

    beforeEach(() => {
      testFaker = createFaker({ seed: 12345 })
    })

    it("should generate image URLs", () => {
      const url = testFaker.image.url()
      expect(url).toMatch(/^https?:\/\//)
    })

    it("should generate avatar URLs", () => {
      const url = testFaker.image.avatar()
      expect(url).toMatch(/^https?:\/\//)
    })

    it("should generate placeholder URLs", () => {
      const url = testFaker.image.placeholder({ width: 800, height: 600 })
      expect(url).toContain("800x600")
    })
  })
})
