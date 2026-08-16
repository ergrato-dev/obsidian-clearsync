import { describe, expect, it } from "vitest";
import { computeBackoffDelay, parseRetryAfterMs, DEFAULT_BACKOFF } from "../src/net/backoff";

describe("computeBackoffDelay", () => {
	const options = { baseDelayMs: 1000, maxDelayMs: 30_000 };

	it("grows exponentially with attempt, before jitter", () => {
		const noJitter = () => 0;
		expect(computeBackoffDelay(0, options, noJitter)).toBe(1000);
		expect(computeBackoffDelay(1, options, noJitter)).toBe(2000);
		expect(computeBackoffDelay(2, options, noJitter)).toBe(4000);
	});

	it("adds up to baseDelayMs of jitter", () => {
		const maxJitter = () => 1;
		expect(computeBackoffDelay(0, options, maxJitter)).toBe(2000); // 1000 + 1*1000
	});

	it("never exceeds maxDelayMs (RN-001)", () => {
		const maxJitter = () => 1;
		expect(computeBackoffDelay(10, options, maxJitter)).toBe(options.maxDelayMs);
	});

	it("defaults to Math.random for jitter when none is provided", () => {
		const delay = computeBackoffDelay(0, options);
		expect(delay).toBeGreaterThanOrEqual(1000);
		expect(delay).toBeLessThanOrEqual(2000);
	});

	it("DEFAULT_BACKOFF matches sync-engine.md's documented defaults", () => {
		expect(DEFAULT_BACKOFF).toEqual({ baseDelayMs: 1000, maxDelayMs: 30_000 });
	});
});

describe("parseRetryAfterMs", () => {
	it("parses a valid integer-seconds header into milliseconds", () => {
		expect(parseRetryAfterMs("5")).toBe(5000);
		expect(parseRetryAfterMs("0")).toBe(0);
	});

	it("returns undefined for a missing header", () => {
		expect(parseRetryAfterMs(undefined)).toBeUndefined();
	});

	it("returns undefined for a non-numeric or negative value", () => {
		expect(parseRetryAfterMs("not-a-number")).toBeUndefined();
		expect(parseRetryAfterMs("-5")).toBeUndefined();
	});
});
