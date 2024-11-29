import type {
	TranslationFileName,
	TranslationFileRequiredChanges,
	TranslationFolder,
	TranslationFolderRequiredChanges,
} from "@/types/translation.js";
import { getLanguageCodeFromLanguage } from "./get-language-code-from-language.js";
import { getTranslationFileContentTokenPaths } from "./get-translation-file-token-paths.js";
import { invariant } from "./invariant.js";

/**
 * Computes the required changes for the translation folder.
 * This function compares the source language file with each target language file
 * and determines which tokens need to be created or deleted in the target files
 * to match the source file.
 *
 * @param translationFolder - The folder containing the source and target language files.
 * @returns A map of required changes for each target language file.
 *
 * @example
 * ```typescript
 * const translationFolder = {
 *   sourceLanguage: { code: 'en', name: 'english' },
 *   targetLanguages: [
 *     { code: 'fr', name: 'french' },
 *     { code: 'es', name: 'spanish' }
 *   ],
 *   files: new Map([
 *     ['en', { languageCode: 'en', content: { greeting: 'Hello', welcome: 'Welcome' } }],
 *     ['fr', { languageCode: 'fr', content: { greeting: 'Bonjour' } }],
 *     ['es', { languageCode: 'es', content: { greeting: 'Hola', farewell: 'Adiós' } }],
 *   ]),
 * };
 *
 * const changes = computeTranslationFolderRequiredChanges(translationFolder);
 * console.log(changes);
 * // Map(2) {
 * //   'fr' => { tokenPathsToCreate: ['welcome'], tokenPathsToDelete: [] },
 * //   'es' => { tokenPathsToCreate: ['welcome'], tokenPathsToDelete: ['farewell'] }
 * // }
 * ```
 */
export function computeTranslationFolderRequiredChanges(
	translationFolder: TranslationFolder,
): TranslationFolderRequiredChanges {
	const { sourceLanguage, targetLanguages, files } = translationFolder;
	const folderRequiredChanges = new Map<TranslationFileName, TranslationFileRequiredChanges>();
	const sourceLanguageCode = getLanguageCodeFromLanguage(sourceLanguage);
	const sourceFile = files.get(sourceLanguageCode);
	invariant(sourceFile, `Source language file not found: ${sourceLanguageCode}`);
	const sourceTokenPaths = getTranslationFileContentTokenPaths(sourceFile.content);

	for (const targetLanguage of targetLanguages) {
		const targetLanguageCode = getLanguageCodeFromLanguage(targetLanguage);
		const targetFile = files.get(targetLanguageCode);
		invariant(targetFile, `Target language file not found: ${targetLanguageCode}`);
		const targetTokenPaths = getTranslationFileContentTokenPaths(targetFile.content);
		const fileRequiredChanges: TranslationFileRequiredChanges = {
			tokenPathsToCreate: [],
			tokenPathsToDelete: [],
		};

		for (const [sourceTokenPath] of sourceTokenPaths) {
			if (!targetTokenPaths.has(sourceTokenPath)) {
				fileRequiredChanges.tokenPathsToCreate.push(sourceTokenPath);
			}
		}

		for (const [targetTokenPath] of targetTokenPaths) {
			if (!sourceTokenPaths.has(targetTokenPath)) {
				fileRequiredChanges.tokenPathsToDelete.push(targetTokenPath);
			}
		}

		folderRequiredChanges.set(targetFile.languageCode, fileRequiredChanges);
	}

	return folderRequiredChanges;
}
