import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserWallet,
  deleteUserWallet,
  getUserWallets,
  getUserWalletsWithBalance,
  updateUserWallet,
} from "../wallet.actions";
import { toast } from "sonner";

const WALLET_KEY = "wallets";

export function useGetWallets() {
  return useQuery({
    queryKey: [WALLET_KEY],
    queryFn: async () => {
      try {
        const result = await getUserWallets();
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

export function useGetWalletsWithBalance() {
  return useQuery({
    queryKey: [WALLET_KEY, "WITH_BALANCE"],
    queryFn: async () => {
      try {
        const result = await getUserWalletsWithBalance();
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

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WALLET_KEY] });
      toast.success("Success create wallet");
    },
    onError: (error) => {
      console.error("Failed to create wallet:", error);
    },
  });
}

export function useUpdateWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: Parameters<typeof updateUserWallet>[0];
      data: Parameters<typeof updateUserWallet>[1];
    }) => {
      return updateUserWallet(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WALLET_KEY] });
      toast.success("Success update wallet");
    },
    onError: (error) => {
      console.error("Failed to update wallet:", error);
      toast.error("Failed to update wallet");
    },
  });
}

export function useDeleteWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: Parameters<typeof deleteUserWallet>[0] }) => {
      return deleteUserWallet(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WALLET_KEY] });
      toast.success("Success delete wallet");
    },
    onError: (error) => {
      console.error("Failed to delete wallet:", error);
      toast.error("Failed to delete wallet");
    },
  });
}
