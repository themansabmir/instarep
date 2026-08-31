import { UserMenu } from "@/components/user-menu";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email: string;
  };
  workspaceName?: string;
}

export function DashboardHeader({ user, workspaceName }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-muted-foreground text-sm">{workspaceName ?? "Workspace"}</div>
      <UserMenu user={user} />
    </header>
  );
}
