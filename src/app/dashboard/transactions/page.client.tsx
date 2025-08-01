"use client";
import { AddTransactionFormDialogButton } from "./components/add-transaction-form-dialog";
import BalanceSummary from "@/components/BalanceSummary";
import { TransactionsTable } from "./components/transactions-table";

function TransactionHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          See your whole transactions here
        </p>
      </div>
      <AddTransactionFormDialogButton />
    </div>
  );
}

export function TransactionsPageClient() {
  return (
    <div className="container w-full max-w-7xl mx-auto p-6 space-y-6">
      <TransactionHeader />
      <BalanceSummary />
      <TransactionsTable />
    </div>
  );
}
