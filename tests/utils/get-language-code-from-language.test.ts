import type { Language, LanguageCode } from "@/types/language.js";
import { getLanguageCodeFromLanguage } from "@/utils/get-language-code-from-language.js";
import { describe, expect, it } from "vitest";

describe.concurrent(getLanguageCodeFromLanguage.name, () => {
	it("returns the language code from a language", () => {
		const language: Language = { code: "en", name: "English" };
		const result: LanguageCode = getLanguageCodeFromLanguage(language);
		expect(result).toBe("en");
	});
});
