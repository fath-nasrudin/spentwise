"use client";
import { TransactionList } from "@/app/dashboard/transactions/components/transaction-list";
import { Metadata } from "next";
import { TransactionDateFilter } from "./transaction-date-filter";
import { useState } from "react";
import { TransactionDateFilterType } from "@/types";
import { formatDateLabel, getDateRange } from "../utils/transaction.utils";
import { TransactionSummaryCard } from "./transaction-summary-card";

export const metadata: Metadata = {
  title: "Transactions",
};

export function TransactionsTable() {
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
      <TransactionList dateRange={range} />
    </div>
  );
}
