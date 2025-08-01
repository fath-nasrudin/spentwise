"use client";
import { DataTable } from "@/components/data-table";
import { createWalletColumns } from "./wallet.columns";
import { useState } from "react";
import { WalletForm } from "./wallet-form";
import { Wallet } from "@/generated/prisma";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletUpdateInput } from "./wallet.schema";
import { WalletWithBalance } from "@/types";
import {
  useDeleteWallet,
  useGetWalletsWithBalance,
  useUpdateWallet,
} from "./hooks/use-wallets";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export function WalletList() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] =
    useState<WalletWithBalance | null>(null);
  const wallets = useGetWalletsWithBalance();
  const { mutateAsync: updateUserWallet } = useUpdateWallet();
  const { mutateAsync: deleteUserWallet } = useDeleteWallet();

  // handle loading and errors
  if (wallets.isLoading) return <TableSkeleton />;
  if (wallets.isError) {
    return <p>Something went wrong</p>;
  }
  if (!wallets.data) return <p>Something went wrong</p>;

  const handleEditWallet = (wallet: WalletWithBalance) => {
    setIsEditDialogOpen(true);
    setSelectedWallet(wallet);
  };
  const handleUpdateWallet = async (data: WalletUpdateInput) => {
    if (!selectedWallet) return {};

    try {
      const result = await updateUserWallet({ id: selectedWallet.id, data });
      if (result.success) {
        setIsEditDialogOpen(false);
        setSelectedWallet(null);
      }
      return result;
    } catch (error) {
      setIsEditDialogOpen(false);
      setSelectedWallet(null);
      console.error("Error happened", error);
      return { message: "Failed to update wallet" };
    }
  };
  const handleDeleteTransaction = async (id: Wallet["id"]) => {
    try {
      const result = await deleteUserWallet({ id });
      if (result?.message) {
        console.info(result.message);
      }
    } catch (error) {
      setIsEditDialogOpen(false);
      setSelectedWallet(null);
      console.error("Error happened", error);
    }
  };
  const columns = createWalletColumns({
    onEdit: handleEditWallet,
    onDelete: handleDeleteTransaction,
  });

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Wallets</h2>

      <DataTable columns={columns} data={wallets.data} />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Wallets</DialogTitle>
          </DialogHeader>
          <WalletForm
            onSubmit={handleUpdateWallet}
            initialData={selectedWallet}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
