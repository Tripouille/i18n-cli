import type { Language, LanguageCode, Languages } from "./language.js";
import type { TranslationToken, TranslationTokenPath } from "./translation.js";

export type GetUpToDateTranslationTokensByTokenPathReturn = Map<LanguageCode, TranslationToken>;
export type GetUpToDateTranslationTokensByTokenPath = (
	tokenPath: TranslationTokenPath,
) => GetUpToDateTranslationTokensByTokenPathReturn;

export type RetrieveRequiredTranslationTokensParams = {
	translationTokenPath: TranslationTokenPath;
	sourceLanguage: Language;
	upToDateTargetLanguages: Languages;
	requiredTargetLanguages: Languages;
	upToDateTranslationTokens: Map<LanguageCode, TranslationToken>;
	getUpToDateTranslationTokensByTokenPath: GetUpToDateTranslationTokensByTokenPath;
};

export type RetrieveRequiredTranslationTokensReturn = Map<LanguageCode, TranslationToken>;

export type RetrieveRequiredTranslationTokens = (
	params: RetrieveRequiredTranslationTokensParams,
) => Promise<RetrieveRequiredTranslationTokensReturn>;

export type TranslationFileFormat = {
	translationFileSpace?: string;
	translationFileTrailingNewline?: boolean;
};

export type I18nCliConfig = {
	i18nFolderAbsolutePath: string;
	sourceLanguage: Language;
	targetLanguages: Languages;
	retrieveRequiredTranslationTokens: RetrieveRequiredTranslationTokens;
	logger: Pick<Console, "log">;
	translationFileFormat?: TranslationFileFormat;
};
