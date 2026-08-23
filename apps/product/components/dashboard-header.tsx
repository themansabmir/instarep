import { UserMenu } from "@/components/user-menu";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-sm text-muted-foreground">Workspace</div>
      <UserMenu />
    </header>
  );
}
