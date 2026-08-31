import { VerifyEmailPanel } from "@/features/auth/components/password-forms";
import { getDevVerificationLink } from "@/lib/dev-verification-link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; pending?: string }>;
}) {
  const params = await searchParams;
  const devVerificationUrl = await getDevVerificationLink(params.email);

  return (
    <VerifyEmailPanel
      email={params.email ?? ""}
      pending={params.pending === "1"}
      devVerificationUrl={devVerificationUrl}
    />
  );
}
