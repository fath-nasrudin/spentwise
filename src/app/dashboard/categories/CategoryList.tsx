import { DataTable } from "@/components/data-table";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { createCategoryColumns } from "./category.columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CategoryForm } from "./CategoryForm";
import { UpdateCategorySchema } from "./category.schema";
import {
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "./hooks/use-categories";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

const USE_TABLE = true;

function CategoryListList({ categories }: { categories: Category[] }) {
  {
    return categories.map((cat) => (
      <div
        key={cat.id}
        className="border hover:border-muted-foreground/60 rounded-md p-2 mb-2"
      >
        <div className={cn("font-medium")}>{cat.name}</div>
        <div className="text-sm text-gray-500">{cat.type}</div>
      </div>
    ));
  }
}

export function CategoryList() {
  // { data }: { data: Category[] }
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const categories = useGetCategories();

  // handle loading and errors
  if (categories.isLoading) return <TableSkeleton />;
  if (categories.isError) {
    return <p>Something went wrong</p>;
  }
  if (!categories.data) return <p>Something went wrong</p>;

  function handleEdit(category: Category) {
    setIsEditDialogOpen(true);
    setSelectedCategory(category);
  }
  async function handleSubmitUpdate(category: UpdateCategorySchema) {
    if (!selectedCategory) return {};

    try {
      const result = await updateCategory.mutateAsync({
        id: selectedCategory.id,
        data: category,
      });

      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
      }
      return result;
    } catch (_) {
      return { message: `Failed to update category ${category.name}` };
    }
  }

  async function handleDelete(id: string) {
    try {
      const result = await deleteCategory.mutateAsync({ id });
      console.info(result.message);
    } catch (_) {
      console.info("Failed to delete category");
    }
  }

  const columns = createCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {USE_TABLE ? (
        <DataTable columns={columns} data={categories.data} />
      ) : (
        <CategoryListList categories={categories.data} />
      )}

      {/* update Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleSubmitUpdate}
            initialData={selectedCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
