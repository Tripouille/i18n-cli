import {
	type TranslationCategory,
	TranslationCategorySchema,
	TranslationTokenSchema,
} from "@/types/translation.js";
import * as v from "valibot";
/**
 * Checks if a translation category contains a translation token.
 *
 * @param translationCategory - The translation category to check.
 * @returns `true` if the translation category contains a translation token, otherwise `false`.
 *
 * @example
 * ```typescript
 * const category = {
 *   key: "token",
 * };
 *
 * const result = translationCategoryContainsTranslationToken(category);
 * console.log(result); // Output: true
 * ```
 */
export function translationCategoryContainsTranslationToken(
	translationCategory: TranslationCategory,
): boolean {
	return Object.values(translationCategory).some((value) =>
		v.is(TranslationCategorySchema, value)
			? translationCategoryContainsTranslationToken(value as TranslationCategory)
			: v.is(TranslationTokenSchema, value),
	);
}
