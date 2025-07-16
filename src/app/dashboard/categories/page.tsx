import { getUserCategories } from "./category.db";
import { CategoriesPageClient } from "./page.client";

export default async function CategoriesPage() {
  const { data: categories } = await getUserCategories();
  return <CategoriesPageClient categories={categories} />;
}
