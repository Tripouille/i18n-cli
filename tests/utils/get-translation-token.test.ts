import type { TranslationFileContent, TranslationTokenPath } from "@/types/translation.js";
import { describe, expect, it } from "vitest";
import { getTranslationToken } from "../../src/utils/get-translation-token.js";

describe.concurrent(getTranslationToken.name, () => {
	const translationFileContent: TranslationFileContent = {
		greeting: {
			hello: "Hello",
			inner: {
				welcome: "Welcome",
			},
		},
	};

	it("returns the correct token for a valid token path", () => {
		const translationTokenPath: TranslationTokenPath = "greeting.hello";
		const result = getTranslationToken({ translationTokenPath, translationFileContent });
		expect(result).toBe("Hello");
	});

	it("returns the correct token for a nested token path", () => {
		const translationTokenPath: TranslationTokenPath = "greeting.inner.welcome";
		const result = getTranslationToken({ translationTokenPath, translationFileContent });
		expect(result).toBe("Welcome");
	});

	it("throws an error if the token key is empty", () => {
		const translationTokenPath: TranslationTokenPath = "greeting.";
		expect(() => getTranslationToken({ translationTokenPath, translationFileContent })).toThrow(
			"Token key should not be empty",
		);
	});

	it("throws an error if the category is not found", () => {
		const translationTokenPath: TranslationTokenPath = "greeting.nonexistent.welcome";
		expect(() => getTranslationToken({ translationTokenPath, translationFileContent })).toThrow(
			"Category not found: nonexistent",
		);
	});

	it("throws an error if the token is not found", () => {
		const translationTokenPath: TranslationTokenPath = "greeting.unknown";
		expect(() => getTranslationToken({ translationTokenPath, translationFileContent })).toThrow(
			"Token not found: greeting.unknown",
		);
	});
});
