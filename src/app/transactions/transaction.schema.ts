import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().min(1),
  type: z.enum(["expense", "income", "transfer"]),
  category: z.uuid(),
  note: z.string().min(1).optional(),
  date: z.date(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
