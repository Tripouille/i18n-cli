import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type TranslationFileContent, TranslationFileContentSchema } from "@/types/translation.js";
import * as v from "valibot";

function parseTranslationFile({
	fileName,
	data,
}: {
	fileName: string;
	data: string;
}): TranslationFileContent {
	try {
		const translationJson = JSON.parse(data);
		return v.parse(TranslationFileContentSchema, translationJson);
	} catch {
		throw new Error(`Cannot load translation file ${fileName}: invalid format`);
	}
}

export async function loadTranslationFile({
	folderPath,
	fileName,
}: {
	folderPath: string;
	fileName: string;
}): Promise<TranslationFileContent> {
	let translationFile: string;

	try {
		const filePath = join(folderPath, fileName);
		translationFile = readFileSync(filePath, "utf8");
	} catch {
		throw new Error(`Cannot load translation file ${fileName}: invalid path`);
	}

	return parseTranslationFile({ fileName, data: translationFile });
}
