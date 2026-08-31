"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { useCreateWorkspace } from "@/features/workspace/presentation/hooks/use-workspace";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "@/features/workspace/presentation/schemas";

export function CreateWorkspaceForm() {
  const router = useRouter();
  const createWorkspaceMutation = useCreateWorkspace();
  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "", timezone: "UTC" },
  });

  async function onSubmit(values: CreateWorkspaceInput) {
    try {
      await createWorkspaceMutation.mutateAsync(values);
      router.push("/onboarding/instagram");
      router.refresh();
    } catch {
      // Toast handled by mutation onError
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your workspace</CardTitle>
        <CardDescription>
          Workspaces keep your Instagram accounts, conversations, and team isolated.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input placeholder="My brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || createWorkspaceMutation.isPending}
            >
              Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
