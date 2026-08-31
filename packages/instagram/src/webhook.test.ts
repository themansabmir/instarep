import { describe, expect, it, beforeAll } from "vitest";

import { encryptToken, decryptToken } from "./token-crypto";
import { extractExternalEventId, extractEventType } from "./webhook-parser";

beforeAll(() => {
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
});

describe("token-crypto", () => {
  it("encrypts and decrypts tokens", () => {
    const plaintext = "instagram-access-token-value";
    const encrypted = encryptToken(plaintext);
    expect(encrypted).not.toContain(plaintext);
    expect(decryptToken(encrypted)).toBe(plaintext);
  });
});

describe("webhook parsing", () => {
  it("extracts messaging event id", () => {
    const payload = {
      object: "instagram",
      entry: [
        {
          id: "page-id",
          messaging: [{ message: { mid: "msg-123" } }],
        },
      ],
    };

    expect(extractExternalEventId(payload)).toBe("msg-123");
    expect(extractEventType(payload)).toBe("instagram");
  });

  it("generates fallback id for unknown payloads", () => {
    const id = extractExternalEventId({ foo: "bar" });
    expect(id).toBeTruthy();
  });
});
