import type { TranslationFileFormat } from "@/types/cli.js";
import type { TranslationFileContent } from "@/types/translation.js";
import {
	defaultSpace,
	stringifyTranslationFileContent,
} from "@/utils/stringify-translation-file.js";
import { describe, expect, it } from "vitest";

describe.concurrent(stringifyTranslationFileContent.name, () => {
	it("stringifies translation file content with default format", () => {
		const content: TranslationFileContent = { key: "value" };
		const result = stringifyTranslationFileContent(content);
		expect(result).toBe(`{\n${defaultSpace}"key": "value"\n}`);
	});

	it("stringifies translation file content with custom space", () => {
		const content: TranslationFileContent = { key: "value" };
		const format: TranslationFileFormat = { translationFileSpace: "  " };
		const result = stringifyTranslationFileContent(content, format);
		expect(result).toBe('{\n  "key": "value"\n}');
	});

	it("adds trailing newline if specified", () => {
		const content: TranslationFileContent = { key: "value" };
		const format: TranslationFileFormat = { translationFileTrailingNewline: true };
		const result = stringifyTranslationFileContent(content, format);
		expect(result).toBe(`{\n${defaultSpace}"key": "value"\n}\n`);
	});

	it("stringifies translation file content with custom space and trailing newline", () => {
		const content: TranslationFileContent = { key: "value" };
		const format: TranslationFileFormat = {
			translationFileSpace: "  ",
			translationFileTrailingNewline: true,
		};
		const result = stringifyTranslationFileContent(content, format);
		expect(result).toBe('{\n  "key": "value"\n}\n');
	});

	it("stringifies translation file content in alphabetical order", () => {
		const content: TranslationFileContent = { b: "valueB", a: "valueA" };
		const result = stringifyTranslationFileContent(content);
		expect(result).toBe(`{\n${defaultSpace}"a": "valueA",\n${defaultSpace}"b": "valueB"\n}`);
	});

	it("stringifies translation file content in alphabetical order with nested objects", () => {
		const content: TranslationFileContent = {
			b: { d: "valueD", c: "valueC" },
			a: { f: "valueF", e: "valueE" },
		};
		const result = stringifyTranslationFileContent(content);
		expect(result).toBe(
			`{\n${defaultSpace}"a": {\n${defaultSpace}${defaultSpace}"e": "valueE",\n${defaultSpace}${defaultSpace}"f": "valueF"\n${defaultSpace}},\n${defaultSpace}"b": {\n${defaultSpace}${defaultSpace}"c": "valueC",\n${defaultSpace}${defaultSpace}"d": "valueD"\n${defaultSpace}}\n}`,
		);
	});
});
