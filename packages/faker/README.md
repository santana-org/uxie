<div align="center">
  <img src="https://raw.githubusercontent.com/santana-org/.github/main/profile/santana-logo.png" alt="Santana" width="980" />
<br/>
<br/>
<strong>@santana-org/faker</strong>
<p>A comprehensive fake data generator for TypeScript/JavaScript — realistic test data, zero dependencies.</p>

[![npm](https://img.shields.io/npm/v/@santana-org/faker?color=CB3837&labelColor=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@santana-org/faker)
[![license](https://img.shields.io/badge/license-MIT-blue?color=3b82f6&labelColor=1d4ed8)](./LICENSE)
[![ESM](https://img.shields.io/badge/ESM-first-green?color=16a34a&labelColor=15803d)](https://nodejs.org/api/esm.html)
</div>

## 📦 Install

```sh
npm install @santana-org/faker
pnpm add @santana-org/faker
```

## 🚀 Quickstart

```ts
import { faker } from "@santana-org/faker"

faker.person.fullName()     // "John Smith"
faker.internet.email()      // "john.smith@gmail.com"
faker.location.city()       // "New York"
faker.finance.creditCard()  // Complete credit card object
faker.number.uuid()         // "550e8400-e29b-41d4-a716-446655440000"
```

## 📖 Providers

| Provider | Methods |
|---|---|
| `person` | `firstName`, `lastName`, `fullName`, `jobTitle`, `age`, `person()` |
| `internet` | `email`, `username`, `password`, `url`, `ipv4`, `jwt` |
| `location` | `city`, `state`, `zipCode`, `country`, `coordinates`, `address()` |
| `finance` | `creditCard`, `amount`, `currency`, `iban`, `bitcoinAddress` |
| `number` | `int`, `float`, `boolean`, `uuid`, `hex` |
| `date` | `past`, `future`, `recent`, `between`, `month`, `weekday` |
| `company` | `name`, `catchPhrase`, `industry`, `company()` |
| `commerce` | `productName`, `price`, `sku`, `review()` |
| `system` | `fileName`, `mimeType`, `semver`, `gitBranch`, `gitCommitMessage` |
| `color` | `hex`, `rgb`, `hsl`, `name`, `palette` |
| `string` | `alphanumeric`, `fromPattern`, `nanoid` |
| `lorem` | `word`, `sentence`, `paragraph`, `slug` |
| `phone` | `number`, `international`, `e164` |
| `vehicle` | `manufacturer`, `model`, `vin`, `licensePlate` |
| `animal` · `music` · `food` · `image` · `science` · `hacker` | various |

## 🧩 Recipes

**Locale support**
```ts
import { createFaker } from "@santana-org/faker"

const es = createFaker({ locale: "es" })
es.person.firstName()  // "Carlos"

// Or switch on the fly
faker.setLocale("es")
```

**Seeded / reproducible data**
```ts
const seeded = createFaker({ seed: 12345 })
seeded.person.firstName()  // Always the same value

faker.seed(12345)
const a = faker.person.firstName()
faker.seed(12345)
const b = faker.person.firstName()
console.log(a === b)  // true
```

## 🏗️ Design decisions

- **Zero dependencies.** No runtime bloat — everything is self-contained.
- **ESM-first.** CJS interop included, written for modern runtimes.
- **Seed-based reproducibility.** Deterministic sequences for reliable test suites.
- **Type-safe by default.** Full TypeScript types for every method and return shape.
- **Locale-aware.** English and Spanish out of the box, easily extensible.

## 📄 License

MIT © [santana-org](https://github.com/santana-org) — contributions are welcome, see [CONTRIBUTING](https://github.com/santana-org/.github/blob/main/CONTRIBUTING.md).
