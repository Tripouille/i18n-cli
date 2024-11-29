/**
 * Asserts that a given condition is true, throwing an error with a specified message if the condition is false.
 *
 * @param condition - The condition to assert. If the condition is false, an error will be thrown.
 * @param message - The error message to display if the condition is false.
 *
 * @example
 * ```typescript
 * invariant(someVariable !== null, "someVariable should not be null");
 * ```
 *
 * @throws {Error} If the condition is false, an error is thrown with the message "Invariant failed: {message}".
 */
export function invariant(condition: unknown, message: string): asserts condition {
	if (condition) return;
	throw new Error(`Invariant failed: ${message}`);
}
