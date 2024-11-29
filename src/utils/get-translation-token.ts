import {
	type TranslationCategory,
	TranslationCategorySchema,
	type TranslationFileContent,
	type TranslationToken,
	type TranslationTokenPath,
	TranslationTokenSchema,
} from "@/types/translation.js";
import * as v from "valibot";
import { invariant } from "./invariant.js";

export function getTranslationToken({
	translationTokenPath,
	translationFileContent,
}: {
	translationTokenPath: TranslationTokenPath;
	translationFileContent: TranslationFileContent;
}): TranslationToken {
	const path = translationTokenPath.split(".");
	const tokenKey = path.pop();
	invariant(tokenKey, "Token key should not be empty");
	let currentCategory: TranslationCategory = translationFileContent;

	for (const key of path) {
		const newCategory = currentCategory[key] as TranslationCategory;
		invariant(v.is(TranslationCategorySchema, newCategory), `Category not found: ${key}`);
		currentCategory = newCategory;
	}

	const token = currentCategory[tokenKey];
	invariant(v.is(TranslationTokenSchema, token), `Token not found: ${translationTokenPath}`);
	return token;
}
