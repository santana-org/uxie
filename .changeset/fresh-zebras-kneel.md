---
"@santana-org/colors": minor
"@santana-org/logger": patch
---
add new shared colors package and use it in logger text formatter

- add `@santana-org/colors` package with ANSI helpers and tests
- migrate `@santana-org/logger` text formatter to consume shared color utilities
