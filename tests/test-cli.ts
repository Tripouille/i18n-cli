import { join } from "node:path";
import { type CreateI18nCliParams, createI18nCli } from "@/index.js";
import type { RetrieveRequiredTranslationTokensReturn } from "@/types/cli.js";
import type { LanguageCode } from "@/types/language.js";
import type { TranslationToken } from "@/types/translation.js";

export const testConfig: CreateI18nCliParams = {
	i18nFolderAbsolutePath: join(__dirname, "./translation-files/i18n"),
	sourceLanguage: {
		code: "en",
		name: "english",
	},
	targetLanguages: [
		{ code: "de", name: "german" },
		{ code: "es", name: "spanish" },
		{ code: "fr", name: "french" },
	],
	async retrieveRequiredTranslationTokens({ requiredTargetLanguages }) {
		const result: RetrieveRequiredTranslationTokensReturn = new Map<
			LanguageCode,
			TranslationToken
		>();

		for (const language of requiredTargetLanguages) {
			const translationToken = `translation token for ${language.code}`;
			result.set(language.code, translationToken);
		}

		await new Promise((resolve) => setTimeout(resolve, 400));
		return result;
	},
	translationFileFormat: {
		translationFileSpace: "\t",
		translationFileTrailingNewline: true,
	},
};

createI18nCli(testConfig).parse();
