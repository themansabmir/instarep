import { describe, expect, it } from "vitest";

import {
  credentialsSchema,
  forgotPasswordSchema,
  mapAuthError,
  resetPasswordSchema,
  signupSchema,
} from "./schemas";

describe("auth schemas", () => {
  it("accepts valid credentials", () => {
    const result = credentialsSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = credentialsSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = credentialsSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid signup", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      name: "Jane Doe",
    });
    expect(result.success).toBe(true);
  });

  it("requires name on signup", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("validates reset password confirmation", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });

  it("accepts forgot password email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });
});

describe("mapAuthError", () => {
  it("maps duplicate email safely", () => {
    expect(mapAuthError({ message: "User already exists" })).toContain("already exists");
  });

  it("maps verification errors", () => {
    expect(mapAuthError({ message: "Email not verified" })).toContain("verify");
  });

  it("returns generic message for unknown errors", () => {
    expect(mapAuthError(null)).toBe("Something went wrong. Please try again.");
  });
});
