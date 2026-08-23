export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "due";
}

export const invoices: Invoice[] = [
  { id: "INV-2026-004", date: "Aug 1, 2026", amount: "$49.00", status: "paid" },
  { id: "INV-2026-003", date: "Jul 1, 2026", amount: "$49.00", status: "paid" },
  { id: "INV-2026-002", date: "Jun 1, 2026", amount: "$49.00", status: "paid" },
];
