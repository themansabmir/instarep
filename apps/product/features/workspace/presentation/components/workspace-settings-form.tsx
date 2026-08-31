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

import { useUpdateWorkspaceSettings } from "@/features/workspace/presentation/hooks/use-workspace";
import {
  workspaceSettingsFormSchema,
  type WorkspaceSettingsFormInput,
} from "@/features/workspace/presentation/schemas";

interface WorkspaceSettingsFormProps {
  workspace: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
  };
}

export function WorkspaceSettingsForm({ workspace }: WorkspaceSettingsFormProps) {
  const router = useRouter();
  const updateWorkspace = useUpdateWorkspaceSettings();
  const form = useForm<WorkspaceSettingsFormInput>({
    resolver: zodResolver(workspaceSettingsFormSchema),
    defaultValues: {
      name: workspace.name,
      timezone: workspace.timezone,
    },
  });

  async function onSubmit(values: WorkspaceSettingsFormInput) {
    try {
      await updateWorkspace.mutateAsync(values);
      router.refresh();
    } catch {
      // Toast handled by mutation onError
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>Manage your workspace settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">Slug</p>
              <p className="text-muted-foreground text-sm">{workspace.slug}</p>
            </div>
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || updateWorkspace.isPending}
            >
              Save changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
