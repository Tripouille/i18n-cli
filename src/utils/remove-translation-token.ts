import {
	type TranslationCategory,
	TranslationCategorySchema,
	type TranslationFileContent,
	type TranslationTokenPath,
	TranslationTokenSchema,
} from "@/types/translation.js";
import * as v from "valibot";
import { invariant } from "./invariant.js";
import { translationCategoryContainsTranslationToken } from "./translation-category-contains-translation-token.js";

/**
 * Removes a translation token from the given translation file content.
 *
 * @param {Object} params - The parameters for the function.
 * @param {TranslationFileContent} params.fileContent - The content of the translation file.
 * @param {string} params.translationTokenPath - The dot-separated path to the translation token to be removed.
 *
 * @throws {Error} If the last key in the token path is not found.
 * @throws {Error} If any category in the path is invalid.
 * @throws {Error} If the last key is not a valid translation token.
 *
 * @example
 * ```typescript
 * const fileContent = {
 *   home: {
 *     title: "Home",
 *     description: "Welcome to the homepage"
 *   }
 * };
 * const translationTokenPath = "home.title";
 * removeTranslationToken({ fileContent, translationTokenPath });
 * // fileContent is now { home: { description: "Welcome to the homepage" } }
 * ```
 */
export function removeTranslationToken({
	fileContent,
	translationTokenPath,
}: {
	fileContent: TranslationFileContent;
	translationTokenPath: TranslationTokenPath;
}): void {
	const path = translationTokenPath.split(".");
	const lastKey = path.pop();
	invariant(lastKey, `Last key not found: ${translationTokenPath}`);

	let currentFileContentCategory: TranslationCategory = fileContent;

	for (const category of path) {
		invariant(
			v.is(TranslationCategorySchema, currentFileContentCategory[category]),
			`Invalid category: ${category}`,
		);
		currentFileContentCategory = currentFileContentCategory[category] as TranslationCategory;
	}

	invariant(
		v.is(TranslationTokenSchema, currentFileContentCategory[lastKey]),
		`Last key is not a token: ${translationTokenPath}`,
	);
	delete currentFileContentCategory[lastKey];

	let previousFileContentCategory: TranslationCategory = fileContent;
	for (const category of path) {
		currentFileContentCategory = previousFileContentCategory[category] as TranslationCategory;
		if (!translationCategoryContainsTranslationToken(currentFileContentCategory)) {
			delete previousFileContentCategory[category];
			return;
		}
		previousFileContentCategory = currentFileContentCategory;
	}
}
