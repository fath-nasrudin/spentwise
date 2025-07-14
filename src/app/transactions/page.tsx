import BalanceSummary from "@/components/BalanceSummary";
import { getUserTransactions } from "./transaction.actions";
import { TransactionList } from "@/app/transactions/TransactionList";
import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";

import { AddTransactionFormDialogButton } from "./add-transaction-form-dialog";

export default async function TransactionsPage() {
  const { data } = await getUserTransactions();
  let { data: categories } = await getUserCategories();
  let { data: walelts } = await getUserWallets();

  if (!data) {
    return <div className="p-4">No transaction found.</div>;
  }
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
        <BalanceSummary />
      </div>

      {/*  */}
      <div>
        <TransactionList
          categories={categories}
          wallets={walelts}
          data={data}
        />
      </div>
    </div>
  );
}
