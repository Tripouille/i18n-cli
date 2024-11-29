import type { TranslationCategory } from "@/types/translation.js";
import { translationCategoryContainsTranslationToken } from "@/utils/translation-category-contains-translation-token.js";
import { describe, expect, it } from "vitest";

describe.concurrent(translationCategoryContainsTranslationToken.name, () => {
	it("returns true when the category contains a translation token", () => {
		const category: TranslationCategory = {
			token: "value",
		};

		expect(translationCategoryContainsTranslationToken(category)).toBe(true);
	});

	it("returns false when the category does not contain a translation token", () => {
		const category: TranslationCategory = {
			subCategory: {
				subSubCategory: {},
			},
		};

		expect(translationCategoryContainsTranslationToken(category)).toBe(false);
	});

	it("returns true when the token is in another category", () => {
		const category: TranslationCategory = {
			subCategory: {
				subSubCategory: {
					token: "value",
				},
			},
		};

		expect(translationCategoryContainsTranslationToken(category)).toBe(true);
	});

	it("returns false for an empty category", () => {
		const category: TranslationCategory = {};

		expect(translationCategoryContainsTranslationToken(category)).toBe(false);
	});
});
