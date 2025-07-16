export * from "./transaction";
import { getUserCategories } from "@/app/dashboard/categories/category.db";
import { getUserWalletsWithBalance } from "@/app/dashboard/wallets/wallet.actions";

export type Category = Awaited<ReturnType<typeof getUserCategories>>["data"][0];
export type WalletWithBalance = Awaited<
  ReturnType<typeof getUserWalletsWithBalance>
>["data"][0];
