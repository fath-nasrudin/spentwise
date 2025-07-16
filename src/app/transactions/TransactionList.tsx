"use client";
import { cn } from "@/lib/utils";
import {
  deleteUserTransaction,
  getUserTransactions,
  updateUserTransaction,
} from "./transaction.actions";
import { Transaction } from "@/types";
import { DataTable } from "./data-table";
import { createTransactionColumns } from "./transaction.columns";
import { useState } from "react";
import { TransactionForm } from "./transaction-form";
import { Category, Wallet } from "@/generated/prisma";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateTransactionSchema } from "./transaction.schema";

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
  categories,
  wallets,
}: {
  data: Awaited<ReturnType<typeof getUserTransactions>>["data"];
  categories: Category[];
  wallets: Wallet[];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("edit clicked");
    setIsEditDialogOpen(true);
    setSelectedTransaction(transaction);
  };
  const handleUpdateTransaction = async (data: UpdateTransactionSchema) => {
    if (!selectedTransaction) return;

    try {
      const result = await updateUserTransaction(selectedTransaction.id, data);
      if (result?.message) {
        console.info(result.message);
      } else {
        console.info("Submitted");
      }
      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      setIsEditDialogOpen(false);
      setSelectedTransaction(null);
      console.error("Error happened", error);
    }
  };
  const handleDeleteTransaction = async (id: Transaction["id"]) => {
    try {
      const result = await deleteUserTransaction(id);
      if (result?.message) {
        console.info(result.message);
      }
    } catch (error) {
      setIsEditDialogOpen(false);
      setSelectedTransaction(null);
      console.error("Error happened", error);
    }
  };
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            wallets={wallets}
            onSubmit={handleUpdateTransaction}
            initialData={selectedTransaction}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
