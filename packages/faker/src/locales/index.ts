import { en } from "./en.js"
import { es } from "./es.js"

export type LocaleData = typeof en

export const locales: { en: LocaleData } & Record<string, LocaleData> = {
  en,
  es: es as unknown as LocaleData,
}

export { en, es }
