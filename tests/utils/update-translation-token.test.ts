import type {
	TranslationFileContent,
	TranslationToken,
	TranslationTokenPath,
} from "@/types/translation.js";
import { updateTranslationToken } from "@/utils/update-translation-token.js";
import { describe, expect, it } from "vitest";

describe.concurrent(updateTranslationToken.name, () => {
	it("updates an existing token", () => {
		const fileContent: TranslationFileContent = {
			greeting: { en: "Hello" },
		};
		const translationTokenPath: TranslationTokenPath = "greeting.en";
		const translationToken: TranslationToken = "Hi";

		updateTranslationToken({ fileContent, translationTokenPath, translationToken });

		expect(fileContent).toEqual({
			greeting: { en: "Hi" },
		});
	});

	it("creates nested categories if they do not exist", () => {
		const fileContent: TranslationFileContent = {};
		const translationTokenPath: TranslationTokenPath = "nested.category.token";
		const translationToken: TranslationToken = "Value";

		updateTranslationToken({ fileContent, translationTokenPath, translationToken });

		expect(fileContent).toEqual({
			nested: {
				category: {
					token: "Value",
				},
			},
		});
	});

	it("throws an error if the last key is not found", () => {
		const fileContent: TranslationFileContent = {};
		const translationTokenPath: TranslationTokenPath = "invalid.path.";
		const translationToken: TranslationToken = "Value";

		expect(() => {
			updateTranslationToken({ fileContent, translationTokenPath, translationToken });
		}).toThrow();
	});

	it("throws an error if it encounters a token on the path", () => {
		const fileContent: TranslationFileContent = { encouter: { token: "Value" } };
		const translationTokenPath: TranslationTokenPath = "encouter.token.destination";
		const translationToken: TranslationToken = "Value";

		expect(() => {
			updateTranslationToken({ fileContent, translationTokenPath, translationToken });
		}).toThrow();
	});
});
