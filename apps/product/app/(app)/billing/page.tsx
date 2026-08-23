import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { InvoiceTable } from "@/features/billing/components/invoice-table";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing" description="Manage your plan and view past invoices." />
      <InvoiceTable />
    </div>
  );
}
