"use client";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onEdit(transaction)}
              className="cursor-pointer"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the transaction &quot;
                    {transaction.note || `Transaction ${transaction.id}`}&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(transaction.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
