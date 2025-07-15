import z from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1),
});

export const updateWalletSchema = createWalletSchema.partial();

export type WalletCreateInput = z.infer<typeof createWalletSchema>;
export type WalletUpdateInput = z.infer<typeof updateWalletSchema>;
