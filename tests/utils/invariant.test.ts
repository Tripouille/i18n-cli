import { invariant } from "@/utils/invariant.js";
import { describe, expect, it } from "vitest";

describe.concurrent(invariant.name, () => {
	it("does not throw an error when the condition is true", () => {
		expect(() => invariant(true, "This should not fail")).not.toThrow();
	});

	it("throws an error with the correct message when the condition is false", () => {
		expect(() => invariant(false, "This should fail")).toThrow(
			"Invariant failed: This should fail",
		);
	});

	it("throws an error with a custom message", () => {
		const customMessage = "Custom error message";
		expect(() => invariant(false, customMessage)).toThrow(`Invariant failed: ${customMessage}`);
	});
});
