import { exit } from "node:process";
import type { I18nCliConfig } from "@/types/cli.js";
import type { Languages } from "@/types/language.js";
import { computeTranslationFolderRequiredChanges } from "@/utils/compute-translation-folder-required-changes.js";
import { createTranslationFolder } from "@/utils/create-translation-folder.js";
import { getLanguageCodeFromLanguage } from "@/utils/get-language-code-from-language.js";
import { groupTranslationFolderRequiredChangesByTokenPath } from "@/utils/group-translation-folder-required-changes-by-token-path.js";
import chalk from "chalk";

export type StatusCommandOptions = {
	verbose?: boolean;
	veryVerbose?: boolean;
	failOnChanges?: boolean;
};

export async function statusCommand(config: I18nCliConfig, options: StatusCommandOptions) {
	const { i18nFolderAbsolutePath, sourceLanguage, targetLanguages } = config;
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

	if (options.verbose || options.veryVerbose) {
		function createInMessage(languages: Languages) {
			return options.veryVerbose
				? `in [${languages.map(getLanguageCodeFromLanguage).join(", ")}]`
				: `[${languages.length}]`;
		}

		config.logger.log(chalk.black.bold("Required changes:"));
		for (const [translationTokenPath, languages] of tokenPathsToCreateMap) {
			config.logger.log(chalk.green(`+ ${translationTokenPath} ${createInMessage(languages)}`));
		}
		for (const [translationTokenPath, languages] of tokenPathsToDeleteMap) {
			config.logger.log(chalk.red(`- ${translationTokenPath} ${createInMessage(languages)}`));
		}
	} else {
		config.logger.log(
			`${chalk.black.bold("Required changes:")} ${`${chalk.green(
				`+ ${tokenPathsToCreateMap.size}`,
			)}`} ${`${chalk.red(`- ${tokenPathsToDeleteMap.size}`)}`}`,
		);
	}

	if (options.failOnChanges) {
		const changesCount = tokenPathsToCreateMap.size + tokenPathsToDeleteMap.size;
		if (changesCount) exit(1);
	}
}
