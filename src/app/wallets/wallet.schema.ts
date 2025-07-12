import z from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1),
});

export interface WalletCreateInput extends z.infer<typeof createWalletSchema> {}
