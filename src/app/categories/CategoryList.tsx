import { DataTable } from "@/components/data-table";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { createCategoryColumns } from "./category.columns";

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

export function CategoryList({ data }: { data: Category[] }) {
  function handleEdit(category: Category) {
    console.log("try to edit");
    console.log({ category });
  }
  function handleDelete(id: string) {
    console.log("try to delete");
    console.log({ id });
  }
  const columns = createCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {USE_TABLE ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <CategoryListList categories={data} />
      )}
    </div>
  );
}
