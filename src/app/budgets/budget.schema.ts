import z from "zod";

export const createBudgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["BUDGET", "GOAL"]),
  period: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  walletId: z.string().optional(),
});

export type BudgetCreateInput = z.infer<typeof createBudgetSchema>;
