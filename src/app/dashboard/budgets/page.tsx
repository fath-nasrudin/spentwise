import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";
import BudgetsPageClient from "./page.client";
export default async function BudgetsPage() {
  const { data: categories } = await getUserCategories();
  const { data: wallets } = await getUserWallets();

  return <BudgetsPageClient categories={categories} wallets={wallets} />;
}
