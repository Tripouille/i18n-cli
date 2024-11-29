import { statusCommand } from "@/commands/status.js";
import { syncCommand } from "@/commands/sync.js";
import { type I18nCliConfig, createI18nCli } from "@/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/commands/status.js");
vi.mock("@/commands/sync.js");
const logger = {
	__id: "provided-logger",
};
const cliConfig = { logger } as unknown as I18nCliConfig;

function convertToCliCommand(command: string) {
	return ["node", "i18n-sync"].concat(command.split(" "));
}

describe(createI18nCli.name, () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("defaults to console logger if none is provided", () => {
		createI18nCli({} as I18nCliConfig).parse(convertToCliCommand("status"));
		expect(statusCommand).toHaveBeenCalledWith({ logger: console }, {});
	});

	it("runs the status command", () => {
		createI18nCli(cliConfig).parse(convertToCliCommand("status"));
		expect(statusCommand).toHaveBeenCalledTimes(1);
		expect(statusCommand).toHaveBeenCalledWith(cliConfig, {});
	});

	it("runs the status command with verbose option", () => {
		createI18nCli(cliConfig).parse(convertToCliCommand("status -v"));
		expect(statusCommand).toHaveBeenCalledTimes(1);
		expect(statusCommand).toHaveBeenNthCalledWith(1, cliConfig, { verbose: true });

		createI18nCli(cliConfig).parse(convertToCliCommand("status --verbose"));
		expect(statusCommand).toHaveBeenCalledTimes(2);
		expect(statusCommand).toHaveBeenNthCalledWith(2, cliConfig, { verbose: true });
	});

	it("runs the status command with very verbose option", () => {
		createI18nCli(cliConfig).parse(convertToCliCommand("status -vv"));
		expect(statusCommand).toHaveBeenCalledTimes(1);
		expect(statusCommand).toHaveBeenNthCalledWith(1, cliConfig, { veryVerbose: true });

		createI18nCli(cliConfig).parse(convertToCliCommand("status --very-verbose"));
		expect(statusCommand).toHaveBeenCalledTimes(2);
		expect(statusCommand).toHaveBeenNthCalledWith(2, cliConfig, { veryVerbose: true });
	});

	it("runs the sync command", () => {
		createI18nCli(cliConfig).parse(convertToCliCommand("sync"));
		expect(syncCommand).toHaveBeenCalledTimes(1);
		expect(syncCommand).toHaveBeenCalledWith(cliConfig, {});
	});

	it("runs the sync command with limit retrieve", () => {
		createI18nCli(cliConfig).parse(convertToCliCommand("sync -lr 10"));
		expect(syncCommand).toHaveBeenCalledTimes(1);
		expect(syncCommand).toHaveBeenNthCalledWith(1, cliConfig, { limitRetrieve: "10" });

		createI18nCli(cliConfig).parse(convertToCliCommand("sync --limit-retrieve 10"));
		expect(syncCommand).toHaveBeenCalledTimes(2);
		expect(syncCommand).toHaveBeenNthCalledWith(2, cliConfig, { limitRetrieve: "10" });
	});
});
