import { getUserTransactions } from "./transaction.actions";
import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";
import { Metadata } from "next";
import { TransactionsPageClient } from "./page.client";

export const metadata: Metadata = {
  title: "Transactions",
};

export default async function TransactionsPage() {
  const { data: transactions } = await getUserTransactions();
  const { data: categories } = await getUserCategories();
  const { data: wallets } = await getUserWallets();

  return (
    <TransactionsPageClient
      categories={categories}
      wallets={wallets}
      transactions={transactions}
    />
  );
}
