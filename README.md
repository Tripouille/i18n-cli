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

## Create i18n cli params
| Property                          | Required | Description                                                     |
| --------------------------------- | -------- | --------------------------------------------------------------- |
| i18nFolderAbsolutePath            | true     | The absolute path to the folder containing your i18n JSON files |
| sourceLanguage                    | true     | The source language used as the reference for translations      |
| targetLanguages                   | true     | The target languages to synchronize translations for            |
| retrieveRequiredTranslationTokens | true     | A function to retrieve missing translation tokens               |
| translationFileFormat             | false    | Configuration options for the format of the output files        |

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

> Feel free to provide any implementation for `retrieveRequiredTranslationTokens`, such as AI generation, as long as you return the expected result. If the returned promise is rejected, the changes will not be applied to the files, but the succeeded promises will be applied.

> Note: If the `retrieveRequiredTranslationTokens` function returns a result with missing tokens, the changes will not be applied.

## Contributing

Pull requests are welcome.  
For major changes, please open an issue first to discuss what you would like to change.  
Please make sure to update tests as appropriate.