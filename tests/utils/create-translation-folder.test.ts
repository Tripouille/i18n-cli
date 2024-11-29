import { join } from "node:path";
import { createTranslationFolder } from "@/utils/create-translation-folder.js";
import { describe, expect, it } from "vitest";

describe.concurrent(createTranslationFolder.name, () => {
	it("creates a model of a translation file folder", () => {
		const path = join(__dirname, "../translation-files/create-translation-folder");
		const sourceLanguage = { code: "en", name: "english" };
		const targetLanguages = [
			{ code: "fr", name: "french" },
			{ code: "es", name: "spanish" },
		];

		const result = createTranslationFolder({
			path,
			sourceLanguage,
			targetLanguages,
		});

		expect(result).resolves.toEqual({
			path,
			sourceLanguage,
			targetLanguages,
			files: new Map([
				[
					"en",
					{
						languageCode: "en",
						name: "en.json",
						content: {
							welcomeMessage: "Welcome to the translation file folder model",
							welcomeModal: {
								title: "Welcome",
								content: "This is the content of the welcome modal",
							},
						},
					},
				],
				[
					"fr",
					{
						languageCode: "fr",
						name: "fr.json",
						content: {
							welcomeMessage: "Bienvenue dans le modèle de fichier de dossier de traduction",
							welcomeModal: {
								title: "Bienvenue",
								content: "Ceci est le contenu de la modale de bienvenue",
							},
						},
					},
				],
				[
					"es",
					{
						languageCode: "es",
						name: "es.json",
						content: {
							welcomeMessage: "Bienvenido al modelo de archivo de carpeta de traducción",
							welcomeModal: {
								title: "Bienvenido",
								content: "Este es el contenido de la modal de bienvenida",
							},
						},
					},
				],
			]),
		});
	});
});
