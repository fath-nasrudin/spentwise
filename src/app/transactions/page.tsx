import BalanceSummary from "@/components/BalanceSummary";
import { getTransactions } from "./transaction.actions";
import { AddTransactionForm } from "@/app/transactions/AddTransactionForm";
import { TransactionList } from "@/app/transactions/TransactionList";
import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";

export default async function TransactionsPage() {
  const data = await getTransactions();
  let { data: categories } = await getUserCategories();
  let { data: walelts } = await getUserWallets();

  if (!data) {
    return <div className="p-4">Tidak ada transaksi yang ditemukan.</div>;
  }
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <AddTransactionForm categories={categories} wallets={walelts} />
      <BalanceSummary />
      <TransactionList data={data} />
    </div>
  );
}
