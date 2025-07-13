import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce.number().min(1),
  type: z.enum(["expense", "income"]),
  categoryId: z.cuid(),
  walletId: z.cuid(),
  date: z.coerce.date(),
  note: z.string().optional(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
