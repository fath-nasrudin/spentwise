"use client";
import { TransactionList } from "@/app/dashboard/transactions/components/transaction-list";
import { getUserCategories } from "../../categories/category.db";
import { getUserWallets } from "../../wallets/wallet.actions";
import { Metadata } from "next";
import { Transaction } from "@/types";
import { TransactionDateFilter } from "./transaction-date-filter";
import { useState } from "react";
import { TransactionDateFilterType } from "@/types";
import { formatDateLabel, getDateRange } from "../utils/transaction.utils";
import { TransactionSummaryCard } from "./transaction-summary-card";

export const metadata: Metadata = {
  title: "Transactions",
};

type Props = {
  transactions: Transaction[];
  categories: Awaited<ReturnType<typeof getUserCategories>>["data"];
  wallets: Awaited<ReturnType<typeof getUserWallets>>["data"];
};
export function TransactionsTable({ categories, wallets }: Props) {
  const [filterType, setFilterType] =
    useState<TransactionDateFilterType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const range = getDateRange(filterType, currentDate);
  const dateLabel = formatDateLabel(filterType, currentDate);

  return (
    <div className="space-y-4">
      <TransactionSummaryCard dateRange={range} label={dateLabel} />
      <TransactionDateFilter
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        filterType={filterType}
        onFilterChange={setFilterType}
      />
      <TransactionList
        categories={categories}
        wallets={wallets}
        dateRange={range}
      />
    </div>
  );
}
