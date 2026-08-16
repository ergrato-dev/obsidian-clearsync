// RF-009 — backoff math and Retry-After parsing, pure and independent of any HTTP
// client so it can wrap any SyncProvider's requester (see withBackoff.ts). Defaults
// match docs/{es,en}/referencia-tecnica/sync-engine.md.

export interface BackoffOptions {
	baseDelayMs: number;
	maxDelayMs: number;
}

export const DEFAULT_BACKOFF: BackoffOptions = {
	baseDelayMs: 1_000,
	maxDelayMs: 30_000,
};

/** RN-001 — never retries a 429 without backoff. Exponential with jitter, capped at
 * maxDelayMs. `jitterFn` is injectable (0..1) so tests can be deterministic. */
export function computeBackoffDelay(
	attempt: number,
	options: BackoffOptions,
	jitterFn: () => number = Math.random,
): number {
	const exponential = options.baseDelayMs * 2 ** attempt;
	const jitter = jitterFn() * options.baseDelayMs;
	return Math.min(exponential + jitter, options.maxDelayMs);
}

/** Dropbox sends `Retry-After` as an integer number of seconds. Returns milliseconds,
 * or undefined if the header is missing/unparseable — callers fall back to
 * computeBackoffDelay() in that case. */
export function parseRetryAfterMs(headerValue: string | undefined): number | undefined {
	if (!headerValue) return undefined;
	const seconds = Number(headerValue);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return seconds * 1000;
}
