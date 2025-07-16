"use client";
import { Button } from "@/components/ui/button";
import { CategoryList } from "./CategoryList";
import { PlusIcon } from "lucide-react";
import { Category } from "@/generated/prisma";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import { createCategory, updateCategory } from "./actions";
import { CreateCategorySchema, UpdateCategorySchema } from "./category.schema";

export function CategoriesPageClient({
  categories,
}: {
  categories: Category[];
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  function onCreateNew() {
    // handle something here
    console.log("should show modal");
    setIsCreateDialogOpen(true);
  }

  async function handleCreateCategory(values: CreateCategorySchema) {
    try {
      const result = await createCategory(values);
      if (result.success) {
        setIsCreateDialogOpen(false);
      }

      return result;
    } catch (_) {
      return { message: "Failed to create Category" };
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your categories</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>
      </div>
      {/* List */}
      <CategoryList data={categories} />

      {/* Dialogs */}
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSubmit={handleCreateCategory} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
