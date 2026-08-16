import { describe, expect, it } from "vitest";
import { resolveLocale, translate } from "../src/i18n";
import { en } from "../src/i18n/en";
import { es } from "../src/i18n/es";

describe("i18n dictionaries", () => {
	it("keep the same key set in en and es (RN-002: never show a raw key)", () => {
		expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
	});
});

describe("resolveLocale", () => {
	it("detects Spanish from an es-* system locale on auto (CA-007.1)", () => {
		expect(resolveLocale("auto", "es-AR")).toBe("es");
	});

	it("falls back to English for unsupported system locales on auto (CA-007.3)", () => {
		expect(resolveLocale("auto", "fr-FR")).toBe("en");
	});

	it("lets a manual preference override the system locale (CA-007.2)", () => {
		expect(resolveLocale("en", "es-ES")).toBe("en");
		expect(resolveLocale("es", "en-US")).toBe("es");
	});
});

describe("translate", () => {
	it("resolves a known key in the requested locale", () => {
		expect(translate("settings.language.title", "es")).toBe("Idioma");
		expect(translate("settings.language.title", "en")).toBe("Language");
	});

	it("falls back to English, then to the raw key, for an unknown key", () => {
		expect(translate("does.not.exist", "es")).toBe("does.not.exist");
	});
});
