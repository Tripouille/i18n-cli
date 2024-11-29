import type { Language } from "@/types/language.js";
import type { TranslationFolderRequiredChanges } from "@/types/translation.js";
import { groupTranslationFolderRequiredChangesByTokenPath } from "@/utils/group-translation-folder-required-changes-by-token-path.js";
import { describe, expect, it } from "vitest";

describe.concurrent(groupTranslationFolderRequiredChangesByTokenPath.name, () => {
	it("groups translation folder required changes by token path", () => {
		const translationFolderRequiredChanges: TranslationFolderRequiredChanges = new Map([
			[
				"fr",
				{
					tokenPathsToCreate: ["welcome", "inner.welcome"],
					tokenPathsToDelete: ["farewell", "inner.farewell"],
				},
			],
			[
				"es",
				{
					tokenPathsToCreate: ["welcome"],
					tokenPathsToDelete: [
						"farewell",
						"inner.farewell",
						"inner.greeting",
						"inner.deepest.deep",
					],
				},
			],
		]);
		const targetLanguages: Language[] = [
			{ code: "fr", name: "french" },
			{ code: "es", name: "spanish" },
		];
		const expectedResult: ReturnType<typeof groupTranslationFolderRequiredChangesByTokenPath> = {
			tokenPathsToCreateMap: new Map([
				[
					"welcome",
					[
						{ code: "fr", name: "french" },
						{ code: "es", name: "spanish" },
					],
				],
				["inner.welcome", [{ code: "fr", name: "french" }]],
			]),
			tokenPathsToDeleteMap: new Map([
				[
					"farewell",
					[
						{ code: "fr", name: "french" },
						{ code: "es", name: "spanish" },
					],
				],
				[
					"inner.farewell",
					[
						{ code: "fr", name: "french" },
						{ code: "es", name: "spanish" },
					],
				],
				["inner.greeting", [{ code: "es", name: "spanish" }]],
				["inner.deepest.deep", [{ code: "es", name: "spanish" }]],
			]),
		};

		const result = groupTranslationFolderRequiredChangesByTokenPath({
			translationFolderRequiredChanges,
			targetLanguages,
		});

		expect(result).toEqual(expectedResult);
	});

	it("handles empty changes", () => {
		const translationFolderRequiredChanges: TranslationFolderRequiredChanges = new Map();
		const targetLanguages: Language[] = [
			{ code: "fr", name: "french" },
			{ code: "es", name: "spanish" },
		];
		const expectedResult: ReturnType<typeof groupTranslationFolderRequiredChangesByTokenPath> = {
			tokenPathsToCreateMap: new Map(),
			tokenPathsToDeleteMap: new Map(),
		};

		const result = groupTranslationFolderRequiredChangesByTokenPath({
			translationFolderRequiredChanges,
			targetLanguages,
		});

		expect(result).toEqual(expectedResult);
	});
});
