import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(["expense", "income"]),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
