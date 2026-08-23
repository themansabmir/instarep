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

import { credentialsSchema, type CredentialsInput } from "@/features/auth/schemas";

type Mode = "login" | "signup";

const copy: Record<Mode, { title: string; description: string; cta: string; alt: string; altHref: string; altLabel: string }> = {
  login: {
    title: "Welcome back",
    description: "Sign in to your Instarep workspace.",
    cta: "Sign in",
    alt: "Don't have an account?",
    altHref: "/signup",
    altLabel: "Sign up",
  },
  signup: {
    title: "Create your account",
    description: "Start collecting reviews in minutes.",
    cta: "Create account",
    alt: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const text = copy[mode];

  const form = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit() {
    // Wire to an auth provider (server action / API) in a real implementation.
    toast.success(mode === "login" ? "Signed in" : "Account created");
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
            <Button type="submit" className="w-full">
              {text.cta}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {text.alt}{" "}
          <Link href={text.altHref} className="font-medium text-foreground underline-offset-4 hover:underline">
            {text.altLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
