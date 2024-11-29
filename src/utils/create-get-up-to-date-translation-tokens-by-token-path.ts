import type {
	GetUpToDateTranslationTokensByTokenPath,
	GetUpToDateTranslationTokensByTokenPathReturn,
} from "@/types/cli.js";
import type { Files } from "@/types/translation.js";
import { getTranslationToken } from "./get-translation-token.js";

export function createGetUpToDateTranslationTokensByTokenPath(
	files: Files,
): GetUpToDateTranslationTokensByTokenPath {
	return (tokenPath) => {
		const result: GetUpToDateTranslationTokensByTokenPathReturn = new Map();
		for (const [languageCode, { content }] of files) {
			try {
				const translationToken = getTranslationToken({
					translationFileContent: content,
					translationTokenPath: tokenPath,
				});
				result.set(languageCode, translationToken);
			} catch {
				// Ignore missing translation tokens
			}
		}
		return result;
	};
}
