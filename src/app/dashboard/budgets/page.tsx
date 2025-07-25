import { Metadata } from "next";
import { getUserCategories } from "../categories/category.db";
import { getUserWallets } from "../wallets/wallet.actions";
import BudgetsPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Budgets",
};

export default async function BudgetsPage() {
  const { data: categories } = await getUserCategories();
  const { data: wallets } = await getUserWallets();

  return <BudgetsPageClient categories={categories} wallets={wallets} />;
}
