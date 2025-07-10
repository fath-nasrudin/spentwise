import BalanceSummary from "@/components/BalanceSummary";
import { cn } from "@/lib/utils";
import { getTransactions } from "../transaction.actions";

export default async function TransactionsPage() {
  const data = await getTransactions();

  return (
    <div className="p-4">
      <BalanceSummary />
      <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
      {data.map((tx) => (
        <div key={tx.id} className="border rounded-md p-2 mb-2">
          <div
            className={cn(
              "font-medium",
              tx.type === "income" ? "text-green-600" : "text-red-600"
            )}
          >
            {tx.type === "income" ? "+" : "-"}Rp{tx.amount}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(tx.date).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
