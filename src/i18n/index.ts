// RF-011 — i18n resolution. See docs/{es,en}/requisitos/RFs/RF-011_ui_i18n.md.
import { en } from "./en";
import { es } from "./es";

export type Locale = "en" | "es";
export type LocalePreference = Locale | "auto";

const dictionaries: Record<Locale, Record<string, string>> = { en, es };

/** RN-001/CA-007.1..3: manual preference wins; "auto" falls back to English for any
 * non-Spanish system locale. */
export function resolveLocale(preference: LocalePreference, systemLocale: string): Locale {
	if (preference !== "auto") return preference;
	return systemLocale.toLowerCase().startsWith("es") ? "es" : "en";
}

/** RN-002: a missing key falls back to English, then to the raw key as a last resort —
 * covered by the en/es parity test so this path should never trigger in practice. */
export function translate(key: string, locale: Locale): string {
	return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}
