# i18n-cli

A CLI tool to synchronize and manage translations across multiple target files from a single source file.

## Installation

```sh
npm i -D @tripouille/i18n-cli  
```

## Usage

### Step 1: Create Your CLI

First, create a TypeScript file for your CLI, for example, `cli.ts`; if you prefer, you can also use JavaScript, but the example provided here is in TypeScript.

```typescript
import { type CreateI18nCliParams, createI18nCli } from '@tripouille/i18n-cli'

const params: CreateI18nCliParams = { ... };
const cli = createI18nCli(params);

cli.parse();
```

### Step 2: Compile and Run Your CLI

You can compile your TypeScript file and run the resulting JavaScript file, or you can run it directly using a TypeScript runner. Here is an example using `bun`:

```sh
bun run ./cli.ts status
```

This command will execute the `status` command of your CLI.

## Create i18n CLI Params

| Property                          | Required | Description                                                     |
| --------------------------------- | -------- | --------------------------------------------------------------- |
| `i18nFolderAbsolutePath`          | Yes      | The absolute path to the folder containing your i18n JSON files |
| `sourceLanguage`                  | Yes      | The source language used as the reference for translations      |
| `targetLanguages`                 | Yes      | The target languages to synchronize translations for            |
| `retrieveRequiredTranslationTokens` | Yes    | A function to retrieve missing translation tokens               |
| `translationFileFormat`           | No       | Configuration options for the format of the output files        |

### Example

```typescript
import {
	type CreateI18nCliParams,
	type RetrieveRequiredTranslationTokensReturn,
} from "@tripouille/i18n-cli";

const params: CreateI18nCliParams = {
	i18nFolderAbsolutePath: join(__dirname, "./locales"),
	sourceLanguage: {
		code: "en",
		name: "english",
	},
	targetLanguages: [
		{ code: "de", name: "german" },
		{ code: "es", name: "spanish" },
		{ code: "fr", name: "french" },
	],
	async retrieveRequiredTranslationTokens({ requiredTargetLanguages }) {
		const result: RetrieveRequiredTranslationTokensReturn = new Map();

		for (const language of requiredTargetLanguages) {
			const translationToken = `translation token for ${language.code}`;
			result.set(language.code, translationToken);
		}

		return result;
	},
	translationFileFormat: {
		translationFileSpace: "\t",
		translationFileTrailingNewline: true,
	},
};
```

## The RetrieveRequiredTranslationTokens function

The `retrieveRequiredTranslationTokens` function is a function that retrieves the missing translation tokens for the target languages for a given token path. This function must be provided by the user. The function receives an object with the following properties:

| Property                             | Description                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `translationTokenPath`               | The token path that requires retrieving the translation tokens for           |
| `sourceLanguage`                     | The source language used as the reference for translations                   |
| `upToDateTargetLanguages`            | The target languages that are already up to date                             |
| `requiredTargetLanguages`            | The target languages for which we need to retrieve a translation             |
| `upToDateTranslationTokens`          | A map containing all the up-to-date translation tokens                       |
| `getUpToDateTranslationTokensByTokenPath` | A function to retrieve all the up-to-date translations for a given token path |

The function must return a promise that resolves to a map containing the missing translation tokens for the target languages. The map must have the target language code as the key and the translation token as the value.


Feel free to provide any implementation for `retrieveRequiredTranslationTokens`, such as AI generation, as long as you return the expected result. If the returned promise is rejected, the changes will not be applied to the files, but the succeeded promises will be applied.

If the `retrieveRequiredTranslationTokens` function returns a result with missing tokens, the changes will not be applied.

## Contributing

Pull requests are welcome.  
For major changes, please open an issue first to discuss what you would like to change.  
Please make sure to update tests as appropriate.