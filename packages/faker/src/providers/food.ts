import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class FoodProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random food adjective
   */
  adjective(): string {
    return this.random.pick(this.locale.food.adjective)
  }

  /**
   * Generate a random dish name
   */
  dish(): string {
    return this.random.pick(this.locale.food.dish)
  }

  /**
   * Generate a random ingredient
   */
  ingredient(): string {
    return this.random.pick(this.locale.food.ingredient)
  }

  /**
   * Generate a random fruit
   */
  fruit(): string {
    return this.random.pick(this.locale.food.fruit)
  }

  /**
   * Generate a random vegetable
   */
  vegetable(): string {
    return this.random.pick(this.locale.food.vegetable)
  }

  /**
   * Generate a random spice
   */
  spice(): string {
    const spices = [
      "Salt",
      "Pepper",
      "Cumin",
      "Paprika",
      "Cinnamon",
      "Turmeric",
      "Oregano",
      "Basil",
      "Thyme",
      "Rosemary",
      "Ginger",
      "Garlic Powder",
      "Onion Powder",
      "Chili Powder",
      "Cayenne",
      "Nutmeg",
      "Cloves",
      "Cardamom",
      "Coriander",
    ]
    return this.random.pick(spices)
  }

  /**
   * Generate a random sauce
   */
  sauce(): string {
    const sauces = [
      "Tomato Sauce",
      "BBQ Sauce",
      "Hot Sauce",
      "Soy Sauce",
      "Teriyaki",
      "Ranch",
      "Blue Cheese",
      "Honey Mustard",
      "Aioli",
      "Pesto",
      "Alfredo",
      "Marinara",
      "Hollandaise",
      "Béarnaise",
      "Chimichurri",
    ]
    return this.random.pick(sauces)
  }

  /**
   * Generate a random meat
   */
  meat(): string {
    const meats = [
      "Chicken",
      "Beef",
      "Pork",
      "Lamb",
      "Turkey",
      "Duck",
      "Fish",
      "Shrimp",
      "Salmon",
      "Tuna",
      "Bacon",
      "Ham",
      "Sausage",
      "Venison",
    ]
    return this.random.pick(meats)
  }

  /**
   * Generate a random description
   */
  description(): string {
    const adj = this.adjective()
    const dish = this.dish()
    const ingredient = this.ingredient()

    const templates = [
      `${adj} ${dish} with ${ingredient}`,
      `Fresh ${dish} seasoned with ${this.spice()}`,
      `${adj} ${ingredient}-infused ${dish}`,
      `Traditional ${dish} served with ${this.sauce()}`,
    ]

    return this.random.pick(templates)
  }

  /**
   * Generate a random ethnic cuisine
   */
  ethnicCategory(): string {
    const cuisines = [
      "Italian",
      "Chinese",
      "Mexican",
      "Indian",
      "Japanese",
      "French",
      "Thai",
      "Greek",
      "Spanish",
      "Korean",
      "Vietnamese",
      "American",
      "Mediterranean",
      "Middle Eastern",
      "African",
      "Brazilian",
    ]
    return this.random.pick(cuisines)
  }
}
