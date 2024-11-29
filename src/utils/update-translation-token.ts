import {
	type TranslationCategory,
	TranslationCategorySchema,
	type TranslationFileContent,
	type TranslationToken,
	type TranslationTokenPath,
} from "@/types/translation.js";
import * as v from "valibot";
import { invariant } from "./invariant.js";

/**
 * Updates the translation token in the given translation file content.
 *
 * @param params - The parameters for updating the translation token.
 * @param params.fileContent - The content of the translation file.
 * @param params.translationTokenPath - The dot-separated path to the translation token.
 * @param params.translationToken - The new translation token to be set.
 *
 * @example
 * ```typescript
 * const fileContent = {
 *   greetings: {
 *     hello: "Hello"
 *   }
 * };
 * const params = {
 *   fileContent,
 *   translationTokenPath: "greetings.hello",
 *   translationToken: "Hi"
 * };
 * updateTranslationToken(params);
 * // fileContent now is { greetings: { hello: "Hi" } }
 * ```
 */
export function updateTranslationToken({
	fileContent,
	translationTokenPath,
	translationToken,
}: {
	fileContent: TranslationFileContent;
	translationTokenPath: TranslationTokenPath;
	translationToken: TranslationToken;
}) {
	const path = translationTokenPath.split(".");
	const lastKey = path.pop();
	invariant(lastKey, `Last key not found: ${translationTokenPath}`);

	let currentFileContentCategory: TranslationCategory = fileContent;

	for (const translationKey of path) {
		if (!currentFileContentCategory[translationKey]) {
			currentFileContentCategory[translationKey] = {};
		}
		const nextCategory = currentFileContentCategory[translationKey] as TranslationCategory;
		invariant(v.is(TranslationCategorySchema, nextCategory), `Invalid category: ${translationKey}`);
		currentFileContentCategory = nextCategory;
	}

	currentFileContentCategory[lastKey] = translationToken;
}
