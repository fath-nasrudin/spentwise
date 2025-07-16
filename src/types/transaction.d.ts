import { getUserTransactions } from "@/app/dashboard/transactions/transaction.actions";

export type Transaction = Awaited<
  ReturnType<typeof getUserTransactions>
>["data"][0];
