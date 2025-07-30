"use client";
import { TransactionList } from "@/app/dashboard/transactions/components/transaction-list";
import { getUserCategories } from "../../categories/category.db";
import { getUserWallets } from "../../wallets/wallet.actions";
import { Metadata } from "next";
import { Transaction } from "@/types";
import { TransactionDateFilter } from "./transaction-date-filter";
import { useState } from "react";
import { TransactionDateFilterType } from "@/types";
import { getDateRange } from "../utils/transaction.utils";

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

  return (
    <div>
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
