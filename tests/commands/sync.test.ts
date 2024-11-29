import { writeFileSync } from "node:fs";
import { type SyncCommandOptions, syncCommand } from "@/commands/sync.js";
import type {
	I18nCliConfig,
	RetrieveRequiredTranslationTokens,
	RetrieveRequiredTranslationTokensReturn,
} from "@/types/cli.js";
import type { LanguageCode } from "@/types/language.js";
import type { TranslationFolder, TranslationToken } from "@/types/translation.js";
import { createTranslationFolder } from "@/utils/create-translation-folder.js";
import { stringifyTranslationFileContent } from "@/utils/stringify-translation-file.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils/create-translation-folder.js");
vi.mock("node:fs");

const createTranslationFolderMock: typeof createTranslationFolder = async ({
	path,
	sourceLanguage,
	targetLanguages,
}: Omit<TranslationFolder, "files">): Promise<TranslationFolder> => {
	const files = new Map([
		[
			"en",
			{
				languageCode: "en",
				name: "en.json",
				content: { welcome: "Welcome", inner: { bye: "Bye" } },
			},
		],
		[
			"fr",
			{
				languageCode: "fr",
				name: "fr.json",
				content: { welcome: "Bonjour" },
			},
		],
		[
			"es",
			{
				languageCode: "es",
				name: "es.json",
				content: {
					extra: "Should be removed",
					inner: { bye: "adios", extraDeep: "Should be removed" },
				},
			},
		],
	]);

	for (const langageCode of files.keys()) {
		if (
			langageCode !== sourceLanguage.code &&
			!targetLanguages.some((lang) => lang.code === langageCode)
		) {
			files.delete(langageCode);
		}
	}

	return {
		path,
		sourceLanguage,
		targetLanguages,
		files,
	};
};

vi.mocked(createTranslationFolder).mockImplementation(createTranslationFolderMock);

const retrieveRequiredTranslationTokensMock: RetrieveRequiredTranslationTokens = async ({
	requiredTargetLanguages,
	translationTokenPath,
}) => {
	const result: RetrieveRequiredTranslationTokensReturn = new Map<LanguageCode, TranslationToken>();
	for (const language of requiredTargetLanguages) {
		result.set(language.code, `${translationTokenPath} ${language.code}`);
	}
	return result;
};

const config: I18nCliConfig = {
	i18nFolderAbsolutePath: "/path/to/translations",
	sourceLanguage: { code: "en", name: "english" },
	targetLanguages: [
		{ code: "fr", name: "french" },
		{ code: "es", name: "spanish" },
	],
	retrieveRequiredTranslationTokens: vi
		.fn()
		.mockImplementation(retrieveRequiredTranslationTokensMock),
	logger: { log: vi.fn() },
};

describe(syncCommand.name, () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("syncs translation files correctly", async () => {
		const options: SyncCommandOptions = {};

		await syncCommand(config, options);

		expect(createTranslationFolder).toHaveBeenCalledWith({
			path: config.i18nFolderAbsolutePath,
			sourceLanguage: config.sourceLanguage,
			targetLanguages: config.targetLanguages,
		});
		expect(config.retrieveRequiredTranslationTokens).toHaveBeenCalledTimes(2);
		expect(config.retrieveRequiredTranslationTokens).toHaveBeenNthCalledWith(1, {
			getUpToDateTranslationTokensByTokenPath: expect.any(Function),
			requiredTargetLanguages: [{ code: "fr", name: "french" }],
			sourceLanguage: { code: "en", name: "english" },
			translationTokenPath: "inner.bye",
			upToDateTargetLanguages: [{ code: "es", name: "spanish" }],
			upToDateTranslationTokens: new Map([
				["es", "adios"],
				["en", "Bye"],
			]),
		});
		expect(config.retrieveRequiredTranslationTokens).toHaveBeenNthCalledWith(2, {
			getUpToDateTranslationTokensByTokenPath: expect.any(Function),
			requiredTargetLanguages: [{ code: "es", name: "spanish" }],
			sourceLanguage: { code: "en", name: "english" },
			translationTokenPath: "welcome",
			upToDateTargetLanguages: [{ code: "fr", name: "french" }],
			upToDateTranslationTokens: new Map([
				["fr", "Bonjour"],
				["en", "Welcome"],
			]),
		});
		expect(writeFileSync).toHaveBeenNthCalledWith(
			1,
			"/path/to/translations/en.json",
			stringifyTranslationFileContent({ welcome: "Welcome", inner: { bye: "Bye" } }),
		);
		expect(writeFileSync).toHaveBeenNthCalledWith(
			2,
			"/path/to/translations/fr.json",
			stringifyTranslationFileContent({
				welcome: "Bonjour",
				inner: { bye: "inner.bye fr" },
			}),
		);
		expect(writeFileSync).toHaveBeenNthCalledWith(
			3,
			"/path/to/translations/es.json",
			stringifyTranslationFileContent({ welcome: "welcome es", inner: { bye: "adios" } }),
		);
	});

	it("limits the number of retrieved tokens if limitRetrieve is set", async () => {
		const options: SyncCommandOptions = { limitRetrieve: "1" };

		await syncCommand(config, options);

		expect(config.retrieveRequiredTranslationTokens).toHaveBeenCalledTimes(
			Number(options.limitRetrieve),
		);
	});

	it("handles no target languages gracefully", async () => {
		const noTargetConfig = { ...config, targetLanguages: [] };
		const options: SyncCommandOptions = {};

		await syncCommand(noTargetConfig, options);

		expect(config.retrieveRequiredTranslationTokens).not.toHaveBeenCalled();
		expect(writeFileSync).toHaveBeenCalledTimes(1);
		expect(writeFileSync).toHaveBeenCalledWith(
			"/path/to/translations/en.json",
			stringifyTranslationFileContent({ welcome: "Welcome", inner: { bye: "Bye" } }),
		);
	});
});
