import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  name: z.string().min(1, "Name is required.").max(150),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export function mapAuthError(error: { message?: string; status?: number } | null): string {
  if (!error?.message) return "Something went wrong. Please try again.";

  const message = error.message.toLowerCase();
  if (message.includes("already") || message.includes("exists")) {
    return "An account with this email already exists.";
  }
  if (message.includes("invalid") && message.includes("email")) {
    return "Enter a valid email address.";
  }
  if (
    message.includes("verify") ||
    message.includes("verification") ||
    message.includes("verified")
  ) {
    return "Please verify your email before signing in.";
  }
  if (message.includes("password") && message.includes("least")) {
    return "Password must be at least 8 characters.";
  }
  if (message.includes("already") && message.includes("password")) {
    return "A password is already set for this account.";
  }
  if (message.includes("credential") || message.includes("invalid email or password")) {
    return "Invalid email or password.";
  }

  return "Something went wrong. Please try again.";
}
