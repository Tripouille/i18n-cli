import { join } from "node:path";
import { loadTranslationFile } from "@/utils/load-translation-file.js";
import { describe, expect, it } from "vitest";

describe.concurrent(loadTranslationFile.name, () => {
	const folderPath = join(__dirname, "../translation-files/load-translation-file");

	it("loads the translation file correctly", () => {
		const fileName = "simple.json";
		const result = loadTranslationFile({ folderPath, fileName });
		const expectedResult = {
			oneKey: "One",
			categoryKey: {
				subKey: "Sub",
				subCategory: {
					subSubKey: "SubSub",
				},
			},
		};

		expect(result).resolves.toEqual(expectedResult);
	});

	it("throws an error when the file path is invalid", () => {
		const fileName = "non-existent.json";

		expect(() => loadTranslationFile({ folderPath, fileName })).rejects.toThrowError(
			/invalid path/,
		);
	});

	it("throws an error when the file format is invalid", () => {
		const fileName = "invalid-format.json";

		expect(() => loadTranslationFile({ folderPath, fileName })).rejects.toThrowError(
			/invalid format/,
		);
	});
});
