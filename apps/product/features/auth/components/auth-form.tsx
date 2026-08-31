"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

import { signIn } from "@/features/auth/lib/auth-client";
import {
  credentialsSchema,
  mapAuthError,
  signupSchema,
  type CredentialsInput,
  type SignupInput,
} from "@/features/auth/schemas";

type Mode = "login" | "signup";

const copy: Record<
  Mode,
  {
    title: string;
    description: string;
    cta: string;
    alt: string;
    altHref: string;
    altLabel: string;
  }
> = {
  login: {
    title: "Welcome back",
    description: "Sign in to your Instabot workspace.",
    cta: "Sign in",
    alt: "Don't have an account?",
    altHref: "/signup",
    altLabel: "Sign up",
  },
  signup: {
    title: "Create your account",
    description:
      "We'll email you a sign-in link to verify your address. You can set a password after verifying.",
    cta: "Continue with email",
    alt: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const text = copy[mode];

  const form = useForm<CredentialsInput | SignupInput>({
    resolver: zodResolver(mode === "signup" ? signupSchema : credentialsSchema),
    defaultValues: mode === "signup" ? { email: "", name: "" } : { email: "", password: "" },
  });

  async function onSubmit(values: CredentialsInput | SignupInput) {
    if (mode === "signup") {
      const signupValues = values as SignupInput;
      const origin = window.location.origin;
      const result = await signIn.magicLink({
        email: signupValues.email,
        name: signupValues.name,
        callbackURL: `${origin}/onboarding`,
        newUserCallbackURL: `${origin}/onboarding/set-password`,
        errorCallbackURL: `${origin}/verify-email?error=1&email=${encodeURIComponent(signupValues.email)}`,
      });

      if (result.error) {
        toast.error(mapAuthError(result.error));
        return;
      }

      toast.success("Check your email for a sign-in link to verify your address.");
      router.push(`/verify-email?pending=1&email=${encodeURIComponent(signupValues.email)}`);
      return;
    }

    const loginValues = values as CredentialsInput;
    const result = await signIn.email({
      email: loginValues.email,
      password: loginValues.password,
    });

    if (result.error) {
      toast.error(mapAuthError(result.error));
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
            {mode === "login" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {mode === "login" && (
              <p className="text-muted-foreground text-sm">
                <Link href="/forgot-password" className="underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </p>
            )}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Please wait…" : text.cta}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          {text.alt}{" "}
          <Link
            href={text.altHref}
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            {text.altLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
