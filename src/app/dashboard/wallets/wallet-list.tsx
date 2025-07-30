"use client";
import {
  deleteUserWallet,
  getUserWalletsWithBalance,
  updateUserWallet,
} from "./wallet.actions";
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

export function WalletList({
  data,
}: {
  data: Awaited<ReturnType<typeof getUserWalletsWithBalance>>["data"];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] =
    useState<WalletWithBalance | null>(null);

  const handleEditWallet = (wallet: WalletWithBalance) => {
    setIsEditDialogOpen(true);
    setSelectedWallet(wallet);
  };
  const handleUpdateWallet = async (data: WalletUpdateInput) => {
    if (!selectedWallet) return {};

    try {
      const result = await updateUserWallet(selectedWallet.id, data);
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
      const result = await deleteUserWallet(id);
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

      <DataTable columns={columns} data={data} />

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
