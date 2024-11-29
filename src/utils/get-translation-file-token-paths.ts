import {
	TranslationCategorySchema,
	type TranslationFileContent,
	type TranslationToken,
	type TranslationTokenPath,
	TranslationTokenSchema,
} from "@/types/translation.js";
import * as v from "valibot";

/**
 * Returns the paths of all translation tokens in the translation file.
 *
 * @param translationFileContent - The translation file to extract the token paths from.
 * @returns A map containing the paths of all translation tokens in the translation file as keys and their corresponding tokens as values.
 *
 * @example
 * ```typescript
 * const translationFile = {
 *   greeting: "Hello",
 *   farewell: "Goodbye",
 *   nested: {
 *     morning: "Good morning",
 *     night: "Good night"
 *   }
 * };
 *
 * const translationTokenPaths = getTranslationFileTokenPaths(translationFile);
 * console.log(translationTokenPaths);
 * // Map(4) {
 * //   'greeting' => 'Hello',
 * //   'farewell' => 'Goodbye',
 * //   'nested.morning' => 'Good morning',
 * //   'nested.night' => 'Good night'
 * // }
 * ```
 */
export function getTranslationFileContentTokenPaths(
	translationFileContent: TranslationFileContent,
	previousFilePath = "",
): Map<TranslationTokenPath, TranslationToken> {
	const translationTokenPaths = new Map<TranslationTokenPath, TranslationToken>();

	for (const [translationKey, translationNode] of Object.entries(translationFileContent)) {
		const currentFilePath = previousFilePath
			? `${previousFilePath}.${translationKey}`
			: translationKey;

		if (v.is(TranslationTokenSchema, translationNode)) {
			translationTokenPaths.set(currentFilePath, translationNode);
		} else if (v.is(TranslationCategorySchema, translationNode)) {
			const categoryTokenPaths = getTranslationFileContentTokenPaths(
				translationNode,
				currentFilePath,
			);

			for (const [categoryTranslationKey, categoryTranslationNode] of categoryTokenPaths) {
				translationTokenPaths.set(categoryTranslationKey, categoryTranslationNode);
			}
		}
	}

	return translationTokenPaths;
}
