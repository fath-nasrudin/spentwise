import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce.number().min(1),
  type: z.enum(["expense", "income", "transfer"]),
  category: z.cuid(),
  date: z.coerce.date(),
  note: z.string().optional(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
