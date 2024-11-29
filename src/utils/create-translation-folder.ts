import type { TranslationFolder } from "@/types/translation.js";
import { getLanguageCodeFromLanguage } from "./get-language-code-from-language.js";
import { loadTranslationFile } from "./load-translation-file.js";

/**
 * Creates a translation file folder.
 * Each language code should match a file in the folder with the shape of code.json.
 *
 * Example folder structure:
 *
 * /path/to/folder
 * ├── en.json
 * ├── fr.json
 * └── es.json
 *
 * @param path - The path to the folder containing the translation files.
 * @param sourceLanguage - The source language for the translation files.
 * @param targetLanguages - The target languages for which the translation files should be synced.
 * @returns A translation folder.
 */
export async function createTranslationFolder({
	path,
	targetLanguages,
	sourceLanguage,
}: Omit<TranslationFolder, "files">): Promise<TranslationFolder> {
	const translationFiles = await Promise.all(
		[sourceLanguage, ...targetLanguages].map(async (language) => {
			const languageCode = getLanguageCodeFromLanguage(language);
			const translationFileName = `${languageCode}.json`;
			const translationFileContent = await loadTranslationFile({
				folderPath: path,
				fileName: translationFileName,
			});

			return {
				languageCode: languageCode,
				name: translationFileName,
				content: translationFileContent,
			};
		}),
	);
	const files = new Map(
		translationFiles.map((translationFile) => [translationFile.languageCode, translationFile]),
	);

	return {
		path,
		sourceLanguage,
		targetLanguages,
		files,
	};
}
