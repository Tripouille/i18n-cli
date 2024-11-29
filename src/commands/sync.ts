import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { I18nCliConfig } from "@/types/cli.js";
import { computeTranslationFolderRequiredChanges } from "@/utils/compute-translation-folder-required-changes.js";
import { createGetUpToDateTranslationTokensByTokenPath } from "@/utils/create-get-up-to-date-translation-tokens-by-token-path.js";
import { createTranslationFolder } from "@/utils/create-translation-folder.js";
import { getLanguageCodeFromLanguage } from "@/utils/get-language-code-from-language.js";
import { getTranslationToken } from "@/utils/get-translation-token.js";
import { groupTranslationFolderRequiredChangesByTokenPath } from "@/utils/group-translation-folder-required-changes-by-token-path.js";
import { invariant } from "@/utils/invariant.js";
import { removeTranslationToken } from "@/utils/remove-translation-token.js";
import { stringifyTranslationFileContent } from "@/utils/stringify-translation-file.js";
import { updateTranslationToken } from "@/utils/update-translation-token.js";
import * as v from "valibot";

const SyncCommandOptionsSchema = v.object({
	limitRetrieve: v.optional(
		v.pipe(v.string(), v.transform(Number), v.number("Limit should be a number")),
	),
});

export type SyncCommandOptions = v.InferInput<typeof SyncCommandOptionsSchema>;

export async function syncCommand(config: I18nCliConfig, options: SyncCommandOptions) {
	const { limitRetrieve } = v.parse(SyncCommandOptionsSchema, options);
	const {
		i18nFolderAbsolutePath,
		sourceLanguage,
		targetLanguages,
		retrieveRequiredTranslationTokens,
	} = config;
	const translationFolder = await createTranslationFolder({
		path: i18nFolderAbsolutePath,
		sourceLanguage,
		targetLanguages,
	});
	const translationFolderRequiredChanges =
		computeTranslationFolderRequiredChanges(translationFolder);
	const { tokenPathsToCreateMap, tokenPathsToDeleteMap } =
		groupTranslationFolderRequiredChangesByTokenPath({
			translationFolderRequiredChanges,
			targetLanguages,
		});
	const getUpToDateTranslationTokensByTokenPath = createGetUpToDateTranslationTokensByTokenPath(
		translationFolder.files,
	);

	const updatePromises = Promise.allSettled(
		Array.from(tokenPathsToCreateMap)
			.slice(0, limitRetrieve)
			.map(async ([translationTokenPath, languages]) => {
				const languageCodes = languages.map(getLanguageCodeFromLanguage);
				const upToDateLanguages = translationFolder.targetLanguages.filter(
					(language) => !languageCodes.includes(language.code),
				);
				const upToDateLanguageCodes = upToDateLanguages
					.map(getLanguageCodeFromLanguage)
					.concat(translationFolder.sourceLanguage.code);
				const upToDateTranslationTokens = new Map();
				upToDateLanguageCodes.map((languageCode) => {
					const file = translationFolder.files.get(languageCode);
					invariant(file, `File not found: ${languageCode}`);
					upToDateTranslationTokens.set(
						languageCode,
						getTranslationToken({
							translationFileContent: file.content,
							translationTokenPath,
						}),
					);
				});
				const requiredTranslationTokens = await retrieveRequiredTranslationTokens({
					translationTokenPath,
					sourceLanguage,
					upToDateTranslationTokens,
					requiredTargetLanguages: languages,
					upToDateTargetLanguages: upToDateLanguages,
					getUpToDateTranslationTokensByTokenPath,
				});

				for (const [languageCode, translationToken] of requiredTranslationTokens) {
					const file = translationFolder.files.get(languageCode);
					invariant(file, `File not found: ${languageCode}`);
					updateTranslationToken({
						fileContent: file.content,
						translationTokenPath,
						translationToken,
					});
				}
			}),
	);
	await updatePromises;

	Array.from(tokenPathsToDeleteMap).map(([translationTokenPath, languageCodes]) => {
		for (const languageCode of languageCodes) {
			const file = translationFolder.files.get(languageCode.code);
			invariant(file, `File not found: ${languageCode.code}`);
			removeTranslationToken({ fileContent: file.content, translationTokenPath });
		}
	});

	const savingPromises = Promise.all(
		Array.from(translationFolder.files).map(async ([_, file]) => {
			const filePath = join(i18nFolderAbsolutePath, file.name);
			writeFileSync(
				filePath,
				stringifyTranslationFileContent(file.content, config.translationFileFormat),
			);
		}),
	);

	await savingPromises;
}
