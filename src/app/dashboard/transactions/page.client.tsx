"use client";
import { AddTransactionFormDialogButton } from "./components/add-transaction-form-dialog";
import BalanceSummary from "@/components/BalanceSummary";
import { Category, Transaction } from "@/types";
import { Wallet } from "@/generated/prisma";
import { TransactionsTable } from "./components/transactions-table";

type TransactionHeaderProps = {
  categories: Category[];
  wallets: Wallet[];
};
function TransactionHeader({ categories, wallets }: TransactionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          See your whole transactions here
        </p>
      </div>
      <AddTransactionFormDialogButton
        categories={categories}
        wallets={wallets}
      />
    </div>
  );
}

type TransactionsPageClientProps = {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
};

export function TransactionsPageClient({
  transactions,
  categories,
  wallets,
}: TransactionsPageClientProps) {
  return (
    <div className="container w-full max-w-7xl mx-auto p-6 space-y-6">
      <TransactionHeader categories={categories} wallets={wallets} />
      <BalanceSummary transactions={transactions} />
      <TransactionsTable
        categories={categories}
        wallets={wallets}
        transactions={transactions}
      />
    </div>
  );
}
