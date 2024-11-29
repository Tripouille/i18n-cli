import type { TranslationFolder, TranslationFolderRequiredChanges } from "@/types/translation.js";
import { computeTranslationFolderRequiredChanges } from "@/utils/compute-translation-folder-required-changes.js";
import { describe, expect, it } from "vitest";

describe.concurrent(computeTranslationFolderRequiredChanges.name, () => {
	it("computes required changes for translation file folder model", () => {
		const translationFileFolderModel: TranslationFolder = {
			path: "./i18n",
			sourceLanguage: { code: "en", name: "english" },
			targetLanguages: [
				{ code: "fr", name: "french" },
				{ code: "es", name: "spanish" },
			],
			files: new Map([
				[
					"en",
					{
						languageCode: "en",
						name: "en.json",
						content: {
							greeting: "Hello",
							welcome: "Welcome",
						},
					},
				],
				[
					"fr",
					{
						languageCode: "fr",
						name: "fr.json",
						content: {
							greeting: "Bonjour",
						},
					},
				],
				[
					"es",
					{
						languageCode: "es",
						name: "es.json",
						content: {
							greeting: "Hola",
							farewell: "Adiós",
							inner: {
								greeting: "Hola",
								deepest: {
									deep: "deep",
								},
							},
						},
					},
				],
			]),
		};

		const result = computeTranslationFolderRequiredChanges(translationFileFolderModel);
		const expectedResult: TranslationFolderRequiredChanges = new Map([
			[
				"fr",
				{
					tokenPathsToCreate: ["welcome"],
					tokenPathsToDelete: [],
				},
			],
			[
				"es",
				{
					tokenPathsToCreate: ["welcome"],
					tokenPathsToDelete: ["farewell", "inner.greeting", "inner.deepest.deep"],
				},
			],
		]);

		expect(result).toEqual(expectedResult);
	});
});
