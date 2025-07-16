"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Category, Wallet } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateTransactionSchema } from "./transaction.schema";
import { createUserTransaction } from "./transaction.actions";
import { TransactionForm } from "./transaction-form";

type Props = { categories: Category[]; wallets: Wallet[] };

export function AddTransactionFormDialogButton({ categories, wallets }: Props) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  async function onSubmit(data: CreateTransactionSchema) {
    try {
      const result = await createUserTransaction(data);
      if (result?.message) {
        console.info(result.message);
      } else {
        console.info("Submitted");
      }
      if (result.success) {
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error happened", error);
    }
  }
  return (
    <>
      <Button
        onClick={() => setIsCreateDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <PlusIcon className="h-4 w-4" />
        Create New
      </Button>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={onSubmit}
            categories={categories}
            wallets={wallets}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
