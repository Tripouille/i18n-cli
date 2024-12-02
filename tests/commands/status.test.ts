import { exit } from "node:process";
import { type StatusCommandOptions, statusCommand } from "@/commands/status.js";
import type { CreateI18nCliParams } from "@/index.js";
import type { TranslationFolder } from "@/types/translation.js";
import { computeTranslationFolderRequiredChanges } from "@/utils/compute-translation-folder-required-changes.js";
import { createTranslationFolder } from "@/utils/create-translation-folder.js";
import { groupTranslationFolderRequiredChangesByTokenPath } from "@/utils/group-translation-folder-required-changes-by-token-path.js";
import chalk from "chalk";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/create-translation-folder.js");
vi.mock("@/utils/compute-translation-folder-required-changes.js");
vi.mock("@/utils/group-translation-folder-required-changes-by-token-path.js");
vi.mock("node:process");

const config: CreateI18nCliParams = {
	i18nFolderAbsolutePath: "/path/to/translations",
	sourceLanguage: { code: "en", name: "english" },
	targetLanguages: [
		{ code: "fr", name: "french" },
		{ code: "es", name: "spanish" },
	],
	retrieveRequiredTranslationTokens: vi.fn(),
};
const tokenPathsToCreateMap = new Map([
	[
		"welcome",
		[
			{ code: "fr", name: "french" },
			{ code: "es", name: "spanish" },
		],
	],
	["inner.welcome", [{ code: "fr", name: "french" }]],
]);
const tokenPathsToDeleteMap = new Map([
	[
		"farewell",
		[
			{ code: "fr", name: "french" },
			{ code: "es", name: "spanish" },
		],
	],
	[
		"inner.farewell",
		[
			{ code: "fr", name: "french" },
			{ code: "es", name: "spanish" },
		],
	],
	["inner.greeting", [{ code: "es", name: "spanish" }]],
	["inner.deepest.deep", [{ code: "es", name: "spanish" }]],
]);
const groupTranslationFolderRequiredChangesByTokenPathReturn: ReturnType<
	typeof groupTranslationFolderRequiredChangesByTokenPath
> = {
	tokenPathsToCreateMap,
	tokenPathsToDeleteMap,
};

vi.mocked(createTranslationFolder).mockResolvedValue({} as TranslationFolder);
vi.mocked(computeTranslationFolderRequiredChanges).mockReturnValue(new Map());
vi.mocked(groupTranslationFolderRequiredChangesByTokenPath).mockReturnValue(
	groupTranslationFolderRequiredChangesByTokenPathReturn,
);

describe(statusCommand.name, () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("logs summary of required changes in non-verbose mode", async () => {
		const logger = { log: vi.fn() };
		const options: StatusCommandOptions = {};

		await statusCommand({ ...config, logger }, options);

		expect(logger.log.mock.calls).toEqual([
			[`${chalk.black.bold("Required changes:")} ${chalk.green("+ 2")} ${chalk.red("- 4")}`],
		]);
	});

	it("logs required changes in verbose mode", async () => {
		const logger = { log: vi.fn() };
		const options: StatusCommandOptions = { verbose: true };

		await statusCommand({ ...config, logger }, options);
		expect(logger.log.mock.calls).toEqual([
			[chalk.black.bold("Required changes:")],
			[chalk.green("+ welcome [2]")],
			[chalk.green("+ inner.welcome [1]")],
			[chalk.red("- farewell [2]")],
			[chalk.red("- inner.farewell [2]")],
			[chalk.red("- inner.greeting [1]")],
			[chalk.red("- inner.deepest.deep [1]")],
		]);
	});

	it("logs required changes in very verbose mode", async () => {
		const logger = { log: vi.fn() };
		const options: StatusCommandOptions = { veryVerbose: true };

		await statusCommand({ ...config, logger }, options);

		expect(logger.log.mock.calls).toEqual([
			[chalk.black.bold("Required changes:")],
			[chalk.green("+ welcome in [fr, es]")],
			[chalk.green("+ inner.welcome in [fr]")],
			[chalk.red("- farewell in [fr, es]")],
			[chalk.red("- inner.farewell in [fr, es]")],
			[chalk.red("- inner.greeting in [es]")],
			[chalk.red("- inner.deepest.deep in [es]")],
		]);
	});

	it("exits with code 1 if failOnChanges is set and there are changes", async () => {
		const logger = { log: vi.fn() };
		const options: StatusCommandOptions = { failOnChanges: true };

		await statusCommand({ ...config, logger }, options);

		expect(exit).toHaveBeenCalledWith(1);
	});

	it("does not exit with code 1 if failOnChanges is set and there are no changes", async () => {
		const logger = { log: vi.fn() };
		const options: StatusCommandOptions = { failOnChanges: true };

		vi.mocked(computeTranslationFolderRequiredChanges).mockReturnValue(new Map());
		vi.mocked(groupTranslationFolderRequiredChangesByTokenPath).mockReturnValue({
			tokenPathsToCreateMap: new Map(),
			tokenPathsToDeleteMap: new Map(),
		});

		await statusCommand({ ...config, logger }, options);

		expect(exit).not.toHaveBeenCalled();
	});
});
