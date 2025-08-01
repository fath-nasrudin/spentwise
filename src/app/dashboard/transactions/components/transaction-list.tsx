"use client";
import { Transaction } from "@/types";
import { DataTable } from "@/components/data-table";
import { createTransactionColumns } from "./transaction.columns";
import { useState } from "react";
import { TransactionForm } from "./transaction-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateTransactionSchema } from "../transaction.schema";
import {
  useDeleteTransaction,
  useGetTransactions,
  useUpdateTransaction,
} from "../hooks/use-transactions";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { toast } from "sonner";

export function TransactionList({
  dateRange,
}: {
  dateRange: { gte: Date; lte: Date };
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const { data, isError, isLoading } = useGetTransactions({
    where: { date: dateRange },
  });
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  if (isError) {
    return <p>Something went wrong</p>;
  }

  if (isLoading) return <TableSkeleton />;

  if (!data) return <p>No data available</p>;

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("edit clicked");
    setIsEditDialogOpen(true);
    setSelectedTransaction(transaction);
  };
  const handleUpdateTransaction = async (data: UpdateTransactionSchema) => {
    if (!selectedTransaction) return;

    try {
      const result = await updateTransaction.mutateAsync({
        id: selectedTransaction.id,
        data,
      });
      if (result?.message) {
        toast.success(result.message);
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
      const result = await deleteTransaction.mutateAsync({ id });
      if (result?.message) {
        toast.info(result.message);
      }
    } catch (error) {
      setIsEditDialogOpen(false);
      setSelectedTransaction(null);
      console.error("Error happened", error);
      toast.error("Error happened");
    }
  };
  const columns = createTransactionColumns({
    onEdit: handleEditTransaction,
    onDelete: handleDeleteTransaction,
  });

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <DataTable columns={columns} data={data} />
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleUpdateTransaction}
            initialData={selectedTransaction}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
