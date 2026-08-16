import { describe, expect, it } from "vitest";
import { waitForAuthorizationCode } from "../src/auth/CallbackServer";

// Distinct ports per test: server.close() doesn't release the socket synchronously
// (pending keep-alive connections), so reusing one port across tests is flaky.
describe("waitForAuthorizationCode", () => {
	it("resolves with the code when state matches", async () => {
		const port = 53199;
		const callback = waitForAuthorizationCode({ port, expectedState: "expected-state" });
		// Attach the assertion before the round-trip so the rejection (if any) is never
		// briefly "unhandled" between the server responding and this line awaiting it.
		const assertion = expect(callback.promise).resolves.toBe("abc123");
		const response = await fetch(
			`http://localhost:${port}/callback?code=abc123&state=expected-state`,
		);
		expect(response.status).toBe(200);
		await assertion;
	});

	it("rejects on a state mismatch", async () => {
		const port = 53200;
		const callback = waitForAuthorizationCode({ port, expectedState: "expected-state" });
		const assertion = expect(callback.promise).rejects.toThrow(/state mismatch/);
		const response = await fetch(`http://localhost:${port}/callback?code=abc123&state=wrong-state`);
		expect(response.status).toBe(400);
		await assertion;
	});

	it("rejects when Dropbox returns an error param", async () => {
		const port = 53201;
		const callback = waitForAuthorizationCode({ port, expectedState: "expected-state" });
		const assertion = expect(callback.promise).rejects.toThrow(/access_denied/);
		const response = await fetch(
			`http://localhost:${port}/callback?error=access_denied&state=expected-state`,
		);
		expect(response.status).toBe(400);
		await assertion;
	});

	it("rejects after the timeout elapses with no request", async () => {
		const port = 53202;
		const callback = waitForAuthorizationCode({ port, expectedState: "s", timeoutMs: 20 });
		await expect(callback.promise).rejects.toThrow(/Timed out/);
	});
});
