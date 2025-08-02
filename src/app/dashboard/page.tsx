import BalanceSummary from "@/components/BalanceSummary";

import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { TransactionList } from "./transactions/components/transaction-list";
import {
  formatDateLabel,
  getDateRange,
} from "./transactions/utils/transaction.utils";
import { TransactionSummaryCard } from "./transactions/components/transaction-summary-card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const date = new Date();
  const dateType = "month";
  const dateRange = getDateRange(dateType, date);
  const label = formatDateLabel(dateType, date);

  return (
    <div className="container w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-6">
        <BalanceSummary />
        <TransactionSummaryCard dateRange={dateRange} label={label} />
      </div>
      <TransactionList dateRange={dateRange} label={label} />
    </div>
  );
}
