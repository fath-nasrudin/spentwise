import { cn } from "@/lib/utils";
import { Category } from "@/generated/prisma";

export function CategoryList({ data }: { data: Category[] }) {
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {data.map((cat) => (
        <div
          key={cat.id}
          className="border hover:border-muted-foreground/60 rounded-md p-2 mb-2"
        >
          <div className={cn("font-medium")}>{cat.name}</div>
          <div className="text-sm text-gray-500">{cat.type}</div>
        </div>
      ))}
    </div>
  );
}
