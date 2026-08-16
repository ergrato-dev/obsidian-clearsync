import { describe, expect, it, vi } from "vitest";
import { withBackoff } from "../src/net/withBackoff";
import type { HttpRequester, HttpResponse } from "../src/auth/dropboxOAuth";

function response(status: number, headers?: Record<string, string>): HttpResponse {
	return { status, headers, json: () => ({}) };
}

function fakeSleep() {
	const calls: number[] = [];
	return { sleep: async (ms: number) => void calls.push(ms), calls };
}

describe("withBackoff", () => {
	it("returns immediately on a non-retryable response, without sleeping", async () => {
		const inner: HttpRequester = vi.fn().mockResolvedValue(response(200));
		const { sleep, calls } = fakeSleep();
		const wrapped = withBackoff(inner, { sleep });

		const result = await wrapped({ url: "https://example.com", method: "GET" });

		expect(result.status).toBe(200);
		expect(inner).toHaveBeenCalledTimes(1);
		expect(calls).toEqual([]);
	});

	it("does not retry other 4xx errors (only 429/5xx are retryable)", async () => {
		const inner: HttpRequester = vi.fn().mockResolvedValue(response(400));
		const wrapped = withBackoff(inner, { sleep: fakeSleep().sleep });

		const result = await wrapped({ url: "https://example.com", method: "GET" });

		expect(result.status).toBe(400);
		expect(inner).toHaveBeenCalledTimes(1);
	});

	it("retries on 429 with backoff (RN-001) and eventually succeeds", async () => {
		const inner: HttpRequester = vi
			.fn()
			.mockResolvedValueOnce(response(429))
			.mockResolvedValueOnce(response(429))
			.mockResolvedValueOnce(response(200));
		const { sleep, calls } = fakeSleep();
		const wrapped = withBackoff(inner, { sleep, jitterFn: () => 0, baseDelayMs: 100 });

		const result = await wrapped({ url: "https://example.com", method: "GET" });

		expect(result.status).toBe(200);
		expect(inner).toHaveBeenCalledTimes(3);
		expect(calls).toEqual([100, 200]); // exponential: attempt 0 -> 100ms, attempt 1 -> 200ms
	});

	it("honors the Retry-After header instead of computed backoff", async () => {
		const inner: HttpRequester = vi
			.fn()
			.mockResolvedValueOnce(response(429, { "Retry-After": "3" }))
			.mockResolvedValueOnce(response(200));
		const { sleep, calls } = fakeSleep();
		const wrapped = withBackoff(inner, { sleep, baseDelayMs: 100 });

		await wrapped({ url: "https://example.com", method: "GET" });

		expect(calls).toEqual([3000]);
	});

	it("falls back to computed backoff on 429 when Retry-After is absent from a present headers object", async () => {
		const inner: HttpRequester = vi
			.fn()
			.mockResolvedValueOnce(response(429, { "X-Other-Header": "1" }))
			.mockResolvedValueOnce(response(200));
		const { sleep, calls } = fakeSleep();
		const wrapped = withBackoff(inner, { sleep, jitterFn: () => 0, baseDelayMs: 250 });

		await wrapped({ url: "https://example.com", method: "GET" });

		expect(calls).toEqual([250]);
	});

	it("retries on 5xx the same way as 429", async () => {
		const inner: HttpRequester = vi
			.fn()
			.mockResolvedValueOnce(response(503))
			.mockResolvedValueOnce(response(200));
		const { sleep } = fakeSleep();
		const wrapped = withBackoff(inner, { sleep, jitterFn: () => 0 });

		const result = await wrapped({ url: "https://example.com", method: "GET" });

		expect(result.status).toBe(200);
		expect(inner).toHaveBeenCalledTimes(2);
	});

	it("gives up after maxRetries and returns the last failing response (step 4 — visible failure)", async () => {
		const inner: HttpRequester = vi.fn().mockResolvedValue(response(429));
		const { sleep } = fakeSleep();
		const wrapped = withBackoff(inner, { sleep, maxRetries: 2, jitterFn: () => 0 });

		const result = await wrapped({ url: "https://example.com", method: "GET" });

		expect(result.status).toBe(429);
		expect(inner).toHaveBeenCalledTimes(3); // initial attempt + 2 retries
	});

	it("maxRetries: 0 means a single attempt, no retries", async () => {
		const inner: HttpRequester = vi.fn().mockResolvedValue(response(500));
		const wrapped = withBackoff(inner, { sleep: fakeSleep().sleep, maxRetries: 0 });

		const result = await wrapped({ url: "https://example.com", method: "GET" });

		expect(result.status).toBe(500);
		expect(inner).toHaveBeenCalledTimes(1);
	});
});
