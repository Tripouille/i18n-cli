import { getTranslationFileContentTokenPaths } from "@/utils/get-translation-file-token-paths.js";
import { describe, expect, it } from "vitest";

describe.concurrent(getTranslationFileContentTokenPaths.name, () => {
	it("returns an empty list when the translation file is empty", () => {
		const translationFile = {};
		const result = getTranslationFileContentTokenPaths(translationFile);
		const expectedResult = new Map();
		expect(result).toEqual(expectedResult);
	});

	it("returns correctly the token paths from the root", () => {
		const translationFile = {
			one: "value",
			two: "value",
		};
		const result = getTranslationFileContentTokenPaths(translationFile);
		const expectedResult = new Map([
			["one", "value"],
			["two", "value"],
		]);
		expect(result).toEqual(expectedResult);
	});

	it("returns correctly the token paths from categories", () => {
		const translationFile = {
			one: "value-1",
			category: { two: "value-2", subCategory: { three: "value-3" } },
			anotherCategory: { four: "value-4" },
		};
		const result = getTranslationFileContentTokenPaths(translationFile);
		const expectedResult = new Map([
			["one", "value-1"],
			["category.two", "value-2"],
			["category.subCategory.three", "value-3"],
			["anotherCategory.four", "value-4"],
		]);
		expect(result).toEqual(expectedResult);
	});
});
