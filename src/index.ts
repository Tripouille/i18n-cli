import { statusCommand } from "@/commands/status.js";
import { syncCommand } from "@/commands/sync.js";
import type { I18nCliConfig } from "@/types/cli.js";
import { Command } from "commander";

export type {
	RetrieveRequiredTranslationTokens,
	RetrieveRequiredTranslationTokensReturn,
} from "@/types/cli.js";

export type CreateI18nCliParams = Omit<I18nCliConfig, "logger"> & {
	logger?: I18nCliConfig["logger"];
};

export function createI18nCli(params: CreateI18nCliParams) {
	const program = new Command();
	const config: I18nCliConfig = {
		...params,
		logger: params.logger ?? console,
	};

	program.name("i18n-cli").description("synchronize translation files").version("1.0.0");

	program
		.command("status")
		.alias("s")
		.description("show the status of the translation files")
		.option("-v, --verbose", "Show the tokens that require changes")
		.option(
			"-vv, --very-verbose",
			"Show the tokens that require changes and the associated languages",
		)
		.action((options) => {
			statusCommand(config, options);
		});

	program
		.command("sync")
		.description("synchronize translation files")
		.option("-lr, --limit-retrieve <limit>", "Limit the number of tokens to retrieve")
		.action((options) => {
			syncCommand(config, options);
		});

	return program;
}
