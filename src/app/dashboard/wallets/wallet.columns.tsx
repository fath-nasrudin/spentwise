"use client";

import { ActionsCell } from "@/components/table/actions-cell";
import { WalletWithBalance } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnsProps {
  onEdit: (wallet: WalletWithBalance) => void;
  onDelete: (id: WalletWithBalance["id"]) => void;
}

export const createWalletColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<WalletWithBalance>[] => [
  {
    accessorKey: "name",
    header: "Wallet",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const wallet = row.original;

      return (
        <ActionsCell
          item={wallet}
          getId={(i) => i.id}
          itemLabel="wallet"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
