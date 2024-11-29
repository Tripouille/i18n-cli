import type { TranslationFileFormat } from "@/types/cli.js";
import type { TranslationFileContent } from "@/types/translation.js";
import stringify from "json-stable-stringify";

export const defaultSpace = "\t";

/**
 * Stringifies a translation file by converting it to a JSON string.
 * The function uses a custom replacer to sort all values alphabetically.
 *
 * @param translationFileContent - The translation file to be stringified.
 * @returns The stringified version of the translation file.
 */
export function stringifyTranslationFileContent(
	translationFileContent: TranslationFileContent,
	translationFileFormat?: TranslationFileFormat,
): string {
	const space = translationFileFormat?.translationFileSpace ?? defaultSpace;
	const trailingNewline = translationFileFormat?.translationFileTrailingNewline ?? false;

	const result = stringify(translationFileContent, {
		space,
	});
	if (trailingNewline) return `${result}\n`;

	return result;
}
