import { redirect } from "next/navigation";

import { SetPasswordForm } from "@/features/auth/components/set-password-form";
import { getSession } from "@/lib/auth";
import { userHasPassword } from "@/lib/user-credentials";

export default async function SetPasswordPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  if (await userHasPassword(session.user.id)) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Secure your account</h1>
        <p className="text-muted-foreground text-sm">
          Your email is verified. Set a password before continuing.
        </p>
      </div>
      <SetPasswordForm />
    </div>
  );
}
