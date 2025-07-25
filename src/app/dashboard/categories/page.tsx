import { Metadata } from "next";
import { getUserCategories } from "./category.db";
import { CategoriesPageClient } from "./page.client";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const { data: categories } = await getUserCategories();
  return <CategoriesPageClient categories={categories} />;
}
