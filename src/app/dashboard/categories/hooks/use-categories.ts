"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getUserCategories,
} from "../actions";
import { toast } from "sonner";

const CATEGORY_KEY = "categories";

export function useGetCategories() {
  return useQuery({
    queryKey: [CATEGORY_KEY],
    queryFn: async () => {
      try {
        const result = await getUserCategories();
        console.log(result);
        if (result.error) {
          throw new Error(result.message || "Something went wrong");
        }
        return result.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message || "Something went wrong");
        }
        throw new Error("Something went wrong");
      }
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      toast.success("Success create category");
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Parameters<typeof updateCategory>[0];
      data: Parameters<typeof updateCategory>[1];
    }) => {
      return updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      toast.success("Success update category");
    },
    onError: (error) => {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: Parameters<typeof deleteCategory>[0] }) => {
      return deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY] });
      toast.success("Success delete category");
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    },
  });
}
