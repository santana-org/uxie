import { describe, it, expect } from "vitest"
import { faker } from "../index.js"

describe("New Providers", () => {
  describe("Movies Provider", () => {
    it("should generate movie titles", () => {
      const title = faker.movies.title()
      expect(typeof title).toBe("string")
      expect(title.length).toBeGreaterThan(0)
    })

    it("should generate directors", () => {
      const director = faker.movies.director()
      expect(typeof director).toBe("string")
      expect(director).toContain(" ")
    })

    it("should generate genres", () => {
      const genre = faker.movies.genre()
      expect(typeof genre).toBe("string")
      expect(genre.length).toBeGreaterThan(0)
    })

    it("should generate plots", () => {
      const plot = faker.movies.plot()
      expect(typeof plot).toBe("string")
      expect(plot.length).toBeGreaterThan(0)
    })
  })

  describe("Education Provider", () => {
    it("should generate university names", () => {
      const university = faker.education.university()
      expect(typeof university).toBe("string")
      expect(university.length).toBeGreaterThan(0)
    })

    it("should generate degrees", () => {
      const degree = faker.education.degree()
      expect(typeof degree).toBe("string")
      expect(degree.includes("of")).toBe(true)
    })

    it("should generate GPAs between 0 and 4", () => {
      const gpa = faker.education.gpa()
      expect(gpa).toBeGreaterThanOrEqual(0)
      expect(gpa).toBeLessThanOrEqual(4)
    })

    it("should generate grades", () => {
      const grade = faker.education.grade()
      expect(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]).toContain(grade)
    })
  })

  describe("Gaming Provider", () => {
    it("should generate usernames", () => {
      const username = faker.gaming.username()
      expect(typeof username).toBe("string")
      expect(username.length).toBeGreaterThan(0)
    })

    it("should generate game titles", () => {
      const gameTitle = faker.gaming.gameTitle()
      expect(typeof gameTitle).toBe("string")
      expect(gameTitle.length).toBeGreaterThan(0)
    })

    it("should generate consoles", () => {
      const console_name = faker.gaming.console()
      expect(typeof console_name).toBe("string")
      expect(console_name.length).toBeGreaterThan(0)
    })

    it("should generate player levels from 1-100", () => {
      const level = faker.gaming.playerLevel()
      expect(level).toBeGreaterThanOrEqual(1)
      expect(level).toBeLessThanOrEqual(100)
    })
  })

  describe("Real Estate Provider", () => {
    it("should generate property types", () => {
      const propType = faker.realEstate.propertyType()
      expect(typeof propType).toBe("string")
      expect(propType.length).toBeGreaterThan(0)
    })

    it("should generate prices", () => {
      const price = faker.realEstate.price()
      expect(typeof price).toBe("number")
      expect(price).toBeGreaterThan(0)
    })

    it("should generate bedrooms", () => {
      const bedrooms = faker.realEstate.bedrooms()
      expect(bedrooms).toBeGreaterThanOrEqual(1)
      expect(bedrooms).toBeLessThanOrEqual(6)
    })

    it("should generate positive bathrooms", () => {
      const bathrooms = faker.realEstate.bathrooms()
      expect(bathrooms).toBeGreaterThanOrEqual(1)
      expect(bathrooms).toBeLessThanOrEqual(4)
    })

    it("should generate listing IDs", () => {
      const listingId = faker.realEstate.listingId()
      expect(typeof listingId).toBe("string")
      expect(listingId).toMatch(/^(MLS|REI|PRO)-\d{6}$/)
    })
  })

  describe("Weather Provider", () => {
    it("should generate weather conditions", () => {
      const condition = faker.weather.condition()
      expect(typeof condition).toBe("string")
      expect(condition.length).toBeGreaterThan(0)
    })

    it("should generate temperatures in Celsius", () => {
      const temp = faker.weather.temperatureCelsius()
      expect(typeof temp).toBe("number")
      expect(temp).toBeGreaterThanOrEqual(-30)
      expect(temp).toBeLessThanOrEqual(45)
    })

    it("should generate humidity percentages", () => {
      const humidity = faker.weather.humidity()
      expect(humidity).toBeGreaterThanOrEqual(10)
      expect(humidity).toBeLessThanOrEqual(100)
    })

    it("should generate wind speeds", () => {
      const windSpeed = faker.weather.windSpeed()
      expect(typeof windSpeed).toBe("number")
      expect(windSpeed).toBeGreaterThanOrEqual(0)
      expect(windSpeed).toBeLessThanOrEqual(100)
    })

    it("should generate wind directions", () => {
      const direction = faker.weather.windDirection()
      expect([
        "North",
        "Northeast",
        "East",
        "Southeast",
        "South",
        "Southwest",
        "West",
        "Northwest",
      ]).toContain(direction)
    })

    it("should generate forecasts", () => {
      const forecast = faker.weather.forecast()
      expect(typeof forecast).toBe("string")
      expect(forecast.includes("°C")).toBe(true)
      expect(forecast.includes("%")).toBe(true)
    })
  })
})
