import * as v from "valibot";
import type { Language, LanguageCode, Languages } from "./language.js";

export const TranslationKeySchema = v.string();
export type TranslationKey = v.InferOutput<typeof TranslationKeySchema>;

export const TranslationTokenSchema = v.string();
export type TranslationToken = v.InferOutput<typeof TranslationTokenSchema>;
export type TranslationTokenPath = string;

export const TranslationCategorySchema: v.BaseSchema<
	unknown,
	TranslationCategory,
	v.BaseIssue<unknown>
> = v.record(
	TranslationKeySchema,
	v.lazy(() => TranslationNodeSchema),
);
export type TranslationCategory = Record<
	TranslationKey,
	| TranslationToken
	| {
			[key: TranslationKey]: TranslationNode;
	  }
>;

export const TranslationNodeSchema = v.union([TranslationTokenSchema, TranslationCategorySchema]);
export type TranslationNode = v.InferOutput<typeof TranslationNodeSchema>;

export const TranslationFileContentSchema = v.record(TranslationKeySchema, TranslationNodeSchema);
export type TranslationFileContent = v.InferOutput<typeof TranslationFileContentSchema>;

export type TranslationFileName = string;

export type TranslationFile = {
	languageCode: LanguageCode;
	name: TranslationFileName;
	content: TranslationFileContent;
};

export type Files = Map<LanguageCode, TranslationFile>;

export type TranslationFolder = {
	path: string;
	sourceLanguage: Language;
	targetLanguages: Languages;
	files: Files;
};

export type TranslationFileRequiredChanges = {
	tokenPathsToCreate: TranslationTokenPath[];
	tokenPathsToDelete: TranslationTokenPath[];
};

export type TranslationFolderRequiredChanges = Map<
	TranslationFileName,
	TranslationFileRequiredChanges
>;
