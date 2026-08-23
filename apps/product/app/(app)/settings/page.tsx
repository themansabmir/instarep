import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/features/settings/components/profile-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and profile." />
      <ProfileForm />
    </div>
  );
}
