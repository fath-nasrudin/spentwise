import z from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1),
});

export type WalletCreateInput = z.infer<typeof createWalletSchema>;
