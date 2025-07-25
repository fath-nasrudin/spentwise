import { getUserTransactions } from "./transaction.actions";
import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";
import { Metadata } from "next";
import { TransactionsTable } from "./transactions-table";
import { AddTransactionFormDialogButton } from "./add-transaction-form-dialog";
import BalanceSummary from "@/components/BalanceSummary";

export const metadata: Metadata = {
  title: "Transactions",
};

export default async function TransactionsPage() {
  const { data: transactions } = await getUserTransactions();
  const { data: categories } = await getUserCategories();
  const { data: walelts } = await getUserWallets();

  return (
    <div className="container w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            See your whole transactions here
          </p>
        </div>
        <AddTransactionFormDialogButton
          categories={categories}
          wallets={walelts}
        />
      </div>

      {/*  */}
      <div>
        <BalanceSummary transactions={transactions} />
      </div>

      {/*  */}
      <TransactionsTable
        transactions={transactions}
        categories={categories}
        wallets={walelts}
      />
    </div>
  );
}
