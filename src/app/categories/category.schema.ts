import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(["expense", "income"]),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
