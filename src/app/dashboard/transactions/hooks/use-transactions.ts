"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserTransaction,
  deleteUserTransaction,
  getUserTransactions,
  getUserTransactionsSummary,
  updateUserTransaction,
} from "../transaction.actions";
import { toast } from "sonner";

const TRANSACTION_KEY = "transactions";

export function useGetTransactions(
  props: Parameters<typeof getUserTransactions>[0]
) {
  return useQuery({
    queryKey: [TRANSACTION_KEY, props],
    queryFn: async () => {
      try {
        const result = await getUserTransactions(props);
        if (!result.success) {
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

export function useGetTransactionsSummary(
  props: Parameters<typeof getUserTransactionsSummary>[0]
) {
  return useQuery({
    queryKey: [TRANSACTION_KEY, "summary", props],
    queryFn: async () => {
      try {
        const result = await getUserTransactionsSummary(props);
        if (!result.success) {
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

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTION_KEY] });
      toast.success("Success create transaction");
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  /**
   * {
      id,
      data,
    }: {
      id: Parameters<typeof updateUserTransaction>[0];
      data: Parameters<typeof updateUserTransaction>[1];
    }
   */
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Parameters<typeof updateUserTransaction>[0];
      data: Parameters<typeof updateUserTransaction>[1];
    }) => {
      return updateUserTransaction(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTION_KEY] });
      toast.success("Success update transaction");
    },
    onError: (error) => {
      console.error("Failed to update transaction:", error);
      toast.error("Failed to update transaction");
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: Parameters<typeof deleteUserTransaction>[0];
    }) => {
      return deleteUserTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTION_KEY] });
      toast.success("Success delete transaction");
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
      toast.error("Failed to delete transaction");
    },
  });
}
