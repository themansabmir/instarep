import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  if (!session.user.emailVerified) redirect("/verify-email?pending=1");

  return (
    <div className="bg-background min-h-dvh">
      <header className="border-b px-6 py-4">
        <div className="mx-auto max-w-3xl text-sm font-medium">Instabot</div>
      </header>
      <main className="mx-auto max-w-3xl px-6">{children}</main>
    </div>
  );
}
