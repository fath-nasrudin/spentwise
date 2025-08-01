"use client";
import { Button } from "@/components/ui/button";
import { WalletForm } from "./wallet-form";
import { WalletList } from "./wallet-list";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletCreateInput } from "./wallet.schema";
import { useState } from "react";
import { useCreateWallet } from "./hooks/use-wallets";

export function WalletsPageClient() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const createUserWallet = useCreateWallet();

  async function handleCreateWallet(data: WalletCreateInput) {
    try {
      const result = await createUserWallet.mutateAsync(data);

      if (result.success) {
        setIsCreateDialogOpen(false);
      }

      return result;
    } catch (_) {
      return { message: "Failed to create wallet" };
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Wallets</h1>
          <p className="text-muted-foreground">Manage your wallets</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Create New
        </Button>
      </div>{" "}
      {/*  */}
      <WalletList />
      {/* Dialogs */}
      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Wallet</DialogTitle>
          </DialogHeader>
          <WalletForm onSubmit={handleCreateWallet} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
