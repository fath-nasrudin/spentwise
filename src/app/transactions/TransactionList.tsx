"use client";
import { cn } from "@/lib/utils";
import { getUserTransactions } from "./transaction.actions";
import { Transaction } from "@/types";
import { DataTable } from "./data-table";
import { createTransactionColumns } from "./transaction.columns";

const USE_TABLE = true;

export function TransactionCard({ tx }: { tx: Transaction }) {
  const getTxTypeClassName = (tx: Transaction) => {
    return tx.type === "income" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="border hover:border-muted-foreground/60 rounded-md p-2 mb-2">
      {/* Amount */}
      <div className={cn("font-medium", getTxTypeClassName(tx))}>
        {tx.type === "income" ? "+" : "-"}Rp{tx.amount}
      </div>

      {/* Date */}
      <div className="text-sm text-gray-500">
        {new Date(tx.date).toLocaleDateString()}
      </div>

      <div className="text-sm text-gray-500">Category: {tx.category.name}</div>
      <div className="text-sm text-gray-500">Wallet: {tx.wallet.name}</div>
    </div>
  );
}

export function TransactionList({
  data,
}: {
  data: Awaited<ReturnType<typeof getUserTransactions>>["data"];
}) {
  const handleEditTransaction = () => console.log("transaction edited");
  const handleDeleteTransaction = () => console.log("transaction deleteed");
  const columns = createTransactionColumns({
    onEdit: handleEditTransaction,
    onDelete: handleDeleteTransaction,
  });

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {USE_TABLE ? (
        <DataTable columns={columns} data={data} />
      ) : (
        data.map((tx) => <TransactionCard key={tx.id} tx={tx} />)
      )}
    </div>
  );
}
