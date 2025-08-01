import { getUserTransactions } from "./transaction.actions";
import { Metadata } from "next";
import { TransactionsPageClient } from "./page.client";

export const metadata: Metadata = {
  title: "Transactions",
};

export default async function TransactionsPage() {
  const { data: transactions } = await getUserTransactions();

  return <TransactionsPageClient transactions={transactions} />;
}
