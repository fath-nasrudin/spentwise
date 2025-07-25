"use client";
import { TransactionList } from "@/app/dashboard/transactions/TransactionList";
import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";
import { Metadata } from "next";
import { Transaction } from "@/types";
import { TransactionDateFilter } from "./transaction-date-filter";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Transactions",
};

type Props = {
  transactions: Transaction[];
  categories: Awaited<ReturnType<typeof getUserCategories>>["data"];
  wallets: Awaited<ReturnType<typeof getUserWallets>>["data"];
};
export function TransactionsTable({ categories, wallets }: Props) {
  const [tx, setTx] = useState<Transaction[]>([]);

  return (
    <div>
      <TransactionDateFilter onFilter={setTx} />
      <TransactionList categories={categories} wallets={wallets} data={tx} />
    </div>
  );
}
