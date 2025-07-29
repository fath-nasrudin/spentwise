import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserTransaction,
  getUserTransactions,
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
