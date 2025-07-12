import { getUserCategories } from "./category.db";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";

export default async function CategoriesPage() {
  const { data: categories } = await getUserCategories();
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category</h1>
      <CategoryForm />
      <CategoryList data={categories} />
    </div>
  );
}
