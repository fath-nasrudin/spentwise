"use client";

import { ActionsCell } from "@/components/table/actions-cell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";

interface ColumnsProps {
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: Transaction["id"]) => void;
}

export const createTransactionColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div>{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "wallet",
    header: "Wallet",
    cell: ({ row }) => {
      const wallet = row.original.wallet;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{wallet.name}</span>
          <span className="text-xs text-muted-foreground">ID: {wallet.id}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <ActionsCell
          item={transaction}
          getId={(i) => i.id}
          itemLabel="transaction"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];
