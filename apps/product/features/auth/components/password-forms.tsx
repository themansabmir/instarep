"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { authClient, signIn } from "@/features/auth/lib/auth-client";
import {
  forgotPasswordSchema,
  mapAuthError,
  type ForgotPasswordInput,
} from "@/features/auth/schemas";

const resendSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type ResendVerificationInput = z.infer<typeof resendSchema>;

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const result = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (result.error) {
      toast.error(mapAuthError(result.error));
      return;
    }

    toast.success("If an account exists, a reset link has been sent.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>We will email you a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Send reset link
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          <Link href="/login" className="underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function VerifyEmailPanel({
  email: initialEmail = "",
  pending = false,
  devVerificationUrl = null,
}: {
  email?: string;
  pending?: boolean;
  devVerificationUrl?: string | null;
}) {
  const router = useRouter();
  const resendForm = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: initialEmail },
  });

  async function onResend(values: ResendVerificationInput) {
    const origin = window.location.origin;
    const result = await signIn.magicLink({
      email: values.email,
      callbackURL: `${origin}/onboarding`,
      newUserCallbackURL: `${origin}/onboarding/set-password`,
      errorCallbackURL: `${origin}/verify-email?error=1&email=${encodeURIComponent(values.email)}`,
    });

    if (result.error) {
      toast.error(mapAuthError(result.error));
      return;
    }

    toast.success("Verification email sent. Check your inbox and spam folder.");
    router.refresh();
  }

  const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          {pending
            ? "We sent a sign-in link to your email. Click the link to verify your address and continue."
            : "Your sign-in link may have expired or is invalid."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          After verifying, you will set a password and continue onboarding.
        </p>

        {isDev && devVerificationUrl && (
          <div className="space-y-2 rounded-md border border-dashed p-3">
            <p className="text-muted-foreground text-xs">
              Development: SMTP accepted the message but Gmail may delay or filter it. Use this link
              to sign in immediately:
            </p>
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href={devVerificationUrl}>Open sign-in link</Link>
            </Button>
          </div>
        )}

        {isDev && !devVerificationUrl && (
          <p className="text-muted-foreground rounded-md border border-dashed p-3 text-xs">
            Development: after resend, the sign-in link appears here and in the{" "}
            <code className="text-foreground">pnpm dev</code> terminal.
          </p>
        )}

        <Form {...resendForm}>
          <form onSubmit={resendForm.handleSubmit(onResend)} className="space-y-3">
            <FormField
              control={resendForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resend sign-in link</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={resendForm.formState.isSubmitting}
            >
              Resend email
            </Button>
          </form>
        </Form>

        <Button asChild className="w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
