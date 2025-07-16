"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "@/components/table/actions-cell";

interface ColumnsProps {
  onEdit: (category: Category) => void;
  onDelete: (id: Category["id"]) => void;
}

export const createCategoryColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div
          className={cn("w-fit px-2 py-0.5 rounded-sm", {
            "text-red-700 bg-red-700/5": type === "expense",
            "text-green-700 bg-green-700/5": type === "income",
          })}
        >
          {type}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <ActionsCell
          item={category}
          getId={(c) => c.id}
          getName={(c) => c.name}
          itemLabel="category"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
