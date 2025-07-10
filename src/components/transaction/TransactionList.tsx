import { cn } from "@/lib/utils";
import { Transaction } from "@/generated/prisma";

export function TransactionList({ data }: { data: Transaction[] }) {
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Riwayat Transaksi</h2>
      {data.map((tx) => (
        <div
          key={tx.id}
          className="border hover:border-muted-foreground/60 rounded-md p-2 mb-2"
        >
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
