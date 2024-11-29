import type { Languages } from "@/types/language.js";
import type {
	TranslationFolderRequiredChanges,
	TranslationTokenPath,
} from "@/types/translation.js";
import { invariant } from "./invariant.js";

/**
 * Groups the required changes in a translation folder by their token paths.
 *
 * @param params - An object containing the required changes for each language and the target languages.
 * @param params.translationFolderRequiredChanges - An object containing the required changes for each language.
 * @param params.targetLanguages - An array of target languages.
 * @returns An object containing maps of create and delete changes grouped by translation token paths.
 *
 * @example
 * ```typescript
 * const translationFolderRequiredChanges = {
 *   en: { tokenPathsToCreate: ['token1'], tokenPathsToDelete: ['token2'] },
 *   fr: { tokenPathsToCreate: ['token1'], tokenPathsToDelete: [] },
 * };
 * const targetLanguages = [{ code: 'en', name: 'english' }, { code: 'fr', name: 'french' }];
 * const result = groupTranslationFolderRequiredChangesByTokenPath({ translationFolderRequiredChanges, targetLanguages });
 * // result.tokenPathsToCreateMap will be a Map with 'token1' as key and an array of languages [{ code: 'en', name: 'english' }, { code: 'fr', name: 'french' }] as value
 * // result.tokenPathsToDeleteMap will be a Map with 'token2' as key and an array of languages [{ code: 'en', name: 'english' }] as value
 * ```
 */
export function groupTranslationFolderRequiredChangesByTokenPath({
	translationFolderRequiredChanges,
	targetLanguages,
}: {
	translationFolderRequiredChanges: TranslationFolderRequiredChanges;
	targetLanguages: Languages;
}) {
	const tokenPathsToCreateMap = new Map<TranslationTokenPath, Languages>();
	const tokenPathsToDeleteMap = new Map<TranslationTokenPath, Languages>();

	for (const [languageCode, changes] of translationFolderRequiredChanges) {
		for (const tokenPathToCreate of changes.tokenPathsToCreate) {
			const language = targetLanguages.find((lang) => lang.code === languageCode);
			invariant(language, `Language not found: ${languageCode}`);

			tokenPathsToCreateMap.set(tokenPathToCreate, [
				...(tokenPathsToCreateMap.get(tokenPathToCreate) ?? []),
				language,
			]);
		}

		for (const tokenPathToDelete of changes.tokenPathsToDelete) {
			const language = targetLanguages.find((lang) => lang.code === languageCode);
			invariant(language, `Language not found: ${languageCode}`);

			tokenPathsToDeleteMap.set(tokenPathToDelete, [
				...(tokenPathsToDeleteMap.get(tokenPathToDelete) ?? []),
				language,
			]);
		}
	}

	return { tokenPathsToCreateMap, tokenPathsToDeleteMap };
}
