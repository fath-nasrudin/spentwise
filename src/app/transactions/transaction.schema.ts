import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce.number().min(1),
  type: z.enum(["expense", "income", "transfer"]),
  category: z.uuid().nonempty(),
  note: z.string().optional(),
  date: z.coerce.date(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
