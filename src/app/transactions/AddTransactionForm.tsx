"use client";
import { Category, Wallet } from "@/generated/prisma";
import { TransactionForm } from "./transaction-form";
import { CreateTransactionSchema } from "./transaction.schema";
import { createUserTransaction } from "./transaction.actions";

type AddTransactionFormProps = { categories: Category[]; wallets: Wallet[] };
export function AddTransactionForm({
  categories,
  wallets,
}: AddTransactionFormProps) {
  async function handleSubmit(data: CreateTransactionSchema) {
    try {
      const result = await createUserTransaction(data);
      if (result?.message) {
        console.info(result.message);
      } else {
        console.info("Submitted");
      }
    } catch (error) {
      console.error("Error happened", error);
    }
  }
  return (
    <TransactionForm
      onSubmit={handleSubmit}
      categories={categories}
      wallets={wallets}
    />
  );
}
