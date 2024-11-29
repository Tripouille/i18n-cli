import type { Language, LanguageCode } from "@/types/language.js";

export function getLanguageCodeFromLanguage(language: Language): LanguageCode {
	return language.code;
}
