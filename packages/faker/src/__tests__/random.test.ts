import { describe, expect, it } from "vitest"
import { MersenneTwister } from "../random.js"

describe("MersenneTwister", () => {
  describe("seed", () => {
    it("should produce reproducible results with the same seed", () => {
      const mt1 = new MersenneTwister(12345)
      const mt2 = new MersenneTwister(12345)

      const results1 = Array.from({ length: 10 }, () => mt1.random())
      const results2 = Array.from({ length: 10 }, () => mt2.random())

      expect(results1).toEqual(results2)
    })

    it("should produce different results with different seeds", () => {
      const mt1 = new MersenneTwister(12345)
      const mt2 = new MersenneTwister(54321)

      const results1 = Array.from({ length: 10 }, () => mt1.random())
      const results2 = Array.from({ length: 10 }, () => mt2.random())

      expect(results1).not.toEqual(results2)
    })

    it("should allow reseeding", () => {
      const mt = new MersenneTwister(12345)
      const first = mt.random()

      mt.seed(12345)
      const second = mt.random()

      expect(first).toBe(second)
    })
  })

  describe("random", () => {
    it("should generate numbers between 0 and 1", () => {
      const mt = new MersenneTwister()

      for (let i = 0; i < 1000; i++) {
        const value = mt.random()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })
  })

  describe("int", () => {
    it("should generate integers within range", () => {
      const mt = new MersenneTwister(42)

      for (let i = 0; i < 1000; i++) {
        const value = mt.int(10, 20)
        expect(value).toBeGreaterThanOrEqual(10)
        expect(value).toBeLessThanOrEqual(20)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    it("should handle single value range", () => {
      const mt = new MersenneTwister(42)
      const value = mt.int(5, 5)
      expect(value).toBe(5)
    })
  })

  describe("float", () => {
    it("should generate floats within range", () => {
      const mt = new MersenneTwister(42)

      for (let i = 0; i < 1000; i++) {
        const value = mt.float(1.5, 2.5)
        expect(value).toBeGreaterThanOrEqual(1.5)
        expect(value).toBeLessThan(2.5)
      }
    })
  })

  describe("pick", () => {
    it("should pick elements from array", () => {
      const mt = new MersenneTwister(42)
      const array = ["a", "b", "c", "d", "e"]

      for (let i = 0; i < 100; i++) {
        const picked = mt.pick(array)
        expect(array).toContain(picked)
      }
    })

    it("should throw on empty array", () => {
      const mt = new MersenneTwister(42)
      expect(() => mt.pick([])).toThrow("Cannot pick from empty array")
    })
  })

  describe("shuffle", () => {
    it("should shuffle array elements", () => {
      const mt = new MersenneTwister(42)
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const shuffled = mt.shuffle(original)

      expect(shuffled).toHaveLength(original.length)
      expect(shuffled.sort((a, b) => a - b)).toEqual(original)
      // With a larger array and different seed, shuffling should change order
      const mt2 = new MersenneTwister(123)
      const original2 = Array.from({ length: 100 }, (_, i) => i)
      const shuffled2 = mt2.shuffle(original2)
      expect(shuffled2.sort((a, b) => a - b)).toEqual(original2)
      // Verify shuffle actually randomizes (at least some elements differ)
      const mt3 = new MersenneTwister(99)
      const original3 = Array.from({ length: 100 }, (_, i) => i)
      const shuffled3 = mt3.shuffle(original3)
      let diffCount = 0
      for (let i = 0; i < original3.length; i++) {
        if (shuffled3[i] !== original3[i]) diffCount++
      }
      expect(diffCount).toBeGreaterThan(50)
    })

    it("should not modify original array", () => {
      const mt = new MersenneTwister(42)
      const original = [1, 2, 3, 4, 5]
      const copy = [...original]

      mt.shuffle(original)

      expect(original).toEqual(copy)
    })
  })

  describe("pickMultiple", () => {
    it("should pick multiple unique elements", () => {
      const mt = new MersenneTwister(42)
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const picked = mt.pickMultiple(array, 5)

      expect(picked).toHaveLength(5)
      expect(new Set(picked).size).toBe(5)
      for (const item of picked) {
        expect(array).toContain(item)
      }
    })

    it("should throw when count exceeds array length", () => {
      const mt = new MersenneTwister(42)
      expect(() => mt.pickMultiple([1, 2, 3], 5)).toThrow(
        "Cannot pick more elements than array length",
      )
    })
  })

  describe("boolean", () => {
    it("should generate booleans", () => {
      const mt = new MersenneTwister(42)
      let trues = 0
      let falses = 0

      for (let i = 0; i < 1000; i++) {
        if (mt.boolean()) {
          trues++
        } else {
          falses++
        }
      }

      expect(trues).toBeGreaterThan(0)
      expect(falses).toBeGreaterThan(0)
    })

    it("should respect probability", () => {
      const mt = new MersenneTwister(42)
      let trues = 0

      for (let i = 0; i < 1000; i++) {
        if (mt.boolean(0.9)) {
          trues++
        }
      }

      expect(trues).toBeGreaterThan(800)
    })
  })

  describe("weighted", () => {
    it("should pick based on weights", () => {
      const mt = new MersenneTwister(42)
      const items = [
        { value: "rare", weight: 1 },
        { value: "common", weight: 100 },
      ]

      let rare = 0
      let common = 0

      for (let i = 0; i < 1000; i++) {
        const picked = mt.weighted(items)
        if (picked === "rare") rare++
        else common++
      }

      expect(common).toBeGreaterThan(rare * 10)
    })
  })
})
