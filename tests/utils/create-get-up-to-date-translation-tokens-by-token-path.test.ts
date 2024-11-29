import type { Files } from "@/types/translation.js";
import { describe, expect, it } from "vitest";
import { createGetUpToDateTranslationTokensByTokenPath } from "../../src/utils/create-get-up-to-date-translation-tokens-by-token-path.js";

describe(createGetUpToDateTranslationTokensByTokenPath.name, () => {
	it("returns a map of translation tokens for a root-level token path", () => {
		const files: Files = new Map([
			["en", { languageCode: "en", name: "en.json", content: { welcome: "Welcome" } }],
			["fr", { languageCode: "fr", name: "fr.json", content: { welcome: "Bonjour" } }],
		]);

		const tokenPath = "welcome";
		const getUpToDateTranslationTokensByTokenPath =
			createGetUpToDateTranslationTokensByTokenPath(files);
		const result = getUpToDateTranslationTokensByTokenPath(tokenPath);

		expect(Array.from(result.entries())).toEqual([
			["en", "Welcome"],
			["fr", "Bonjour"],
		]);
	});

	it("returns a map of translation tokens for a deep token path", () => {
		const files: Files = new Map([
			[
				"en",
				{
					languageCode: "en",
					name: "en.json",
					content: { inner: { deep: { value: "Deep Value" } } },
				},
			],
			[
				"fr",
				{
					languageCode: "fr",
					name: "fr.json",
					content: { inner: { deep: { value: "Valeur Profonde" } } },
				},
			],
		]);

		const tokenPath = "inner.deep.value";
		const getUpToDateTranslationTokensByTokenPath =
			createGetUpToDateTranslationTokensByTokenPath(files);
		const result = getUpToDateTranslationTokensByTokenPath(tokenPath);

		expect(Array.from(result.entries())).toEqual([
			["en", "Deep Value"],
			["fr", "Valeur Profonde"],
		]);
	});

	it("returns only existing translation tokens at root level", () => {
		const files: Files = new Map([
			["en", { languageCode: "en", name: "en.json", content: { welcome: "Welcome" } }],
			["fr", { languageCode: "fr", name: "fr.json", content: {} }],
		]);

		const tokenPath = "welcome";
		const getUpToDateTranslationTokensByTokenPath =
			createGetUpToDateTranslationTokensByTokenPath(files);
		const result = getUpToDateTranslationTokensByTokenPath(tokenPath);

		expect(Array.from(result.entries())).toEqual([["en", "Welcome"]]);
	});

	it("returns only existing translation tokens for a deep token path", () => {
		const files: Files = new Map([
			[
				"en",
				{
					languageCode: "en",
					name: "en.json",
					content: { inner: { deep: { value: "Deep Value" } } },
				},
			],
			[
				"fr",
				{
					languageCode: "fr",
					name: "fr.json",
					content: { inner: { deep: {} } },
				},
			],
		]);

		const tokenPath = "inner.deep.value";
		const getUpToDateTranslationTokensByTokenPath =
			createGetUpToDateTranslationTokensByTokenPath(files);
		const result = getUpToDateTranslationTokensByTokenPath(tokenPath);

		expect(Array.from(result.entries())).toEqual([["en", "Deep Value"]]);
	});
});
