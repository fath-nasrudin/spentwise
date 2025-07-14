import { getUserTransactions } from "@/app/transactions/transaction.actions";

export type Transaction = Awaited<
  ReturnType<typeof getUserTransactions>
>["data"][0];
