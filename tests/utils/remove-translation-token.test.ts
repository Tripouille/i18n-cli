import type { TranslationFileContent } from "@/types/translation.js";
import { removeTranslationToken } from "@/utils/remove-translation-token.js";
import { describe, expect, it } from "vitest";

describe.concurrent(removeTranslationToken.name, () => {
	it("removes a token at the root level", () => {
		const fileContent: TranslationFileContent = {
			hello: "world",
			goodbye: "world",
		};
		removeTranslationToken({ fileContent, translationTokenPath: "hello" });
		expect(fileContent).toEqual({ goodbye: "world" });
	});

	it("removes a nested token", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				hello: "world",
				goodbye: "world",
			},
		};
		removeTranslationToken({ fileContent, translationTokenPath: "greetings.hello" });
		expect(fileContent).toEqual({ greetings: { goodbye: "world" } });
	});

	it("removes a deeply nested token", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				inner: {
					hello: "world",
					goodbye: "world",
				},
			},
		};
		removeTranslationToken({ fileContent, translationTokenPath: "greetings.inner.hello" });
		expect(fileContent).toEqual({ greetings: { inner: { goodbye: "world" } } });
	});

	it("removes an empty category after removing a token", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				hello: "world",
			},
		};
		removeTranslationToken({ fileContent, translationTokenPath: "greetings.hello" });
		expect(fileContent).toEqual({});
	});

	it("removes an empty category after removing a token on multiple level", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				inner: {
					hello: "world",
				},
			},
		};
		removeTranslationToken({ fileContent, translationTokenPath: "greetings.inner.hello" });
		expect(fileContent).toEqual({});
	});

	it("removes an empty category after removing a token and left the not empty category intact", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				anotherToken: "world",
				inner: {
					hello: "world",
				},
			},
		};
		removeTranslationToken({ fileContent, translationTokenPath: "greetings.inner.hello" });
		expect(fileContent).toEqual({ greetings: { anotherToken: "world" } });
	});

	it("throws an error when the specified path does not exist", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				hello: "world",
			},
		};

		expect(() =>
			removeTranslationToken({ fileContent, translationTokenPath: "greetings.goodbye" }),
		).toThrow();
	});

	it("throws an error when the specified path is not a token", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				hello: "world",
			},
		};

		expect(() =>
			removeTranslationToken({ fileContent, translationTokenPath: "greetings" }),
		).toThrow();
	});

	it("throws an error when the last key is empty", () => {
		const fileContent: TranslationFileContent = {
			greetings: {
				hello: "world",
			},
		};

		expect(() =>
			removeTranslationToken({ fileContent, translationTokenPath: "greetings." }),
		).toThrow();
	});
});
