import BalanceSummary from "@/components/BalanceSummary";
import { getTransactions } from "../../actions/transaction.actions";
import { AddTransactionForm } from "@/components/transaction/AddTransactionForm";
import { TransactionList } from "@/components/transaction/TransactionList";
import { getUserCategories } from "../categories/category.db";

export default async function TransactionsPage() {
  const data = await getTransactions();
  let { data: categories } = await getUserCategories();

  if (!data) {
    return <div className="p-4">Tidak ada transaksi yang ditemukan.</div>;
  }
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <AddTransactionForm categories={categories} />
      <BalanceSummary />
      <TransactionList data={data} />
    </div>
  );
}
