// app/budgets/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BudgetForm } from "./budget-form";
import { BudgetList } from "./budget-list";
import { IBudgetClient } from "@/types/budget";
import { BudgetCreateInput } from "./budget.schema";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

interface Wallet {
  id: string;
  name: string;
}

export default function BudgetsPage({
  wallets,
  categories,
}: {
  wallets: Wallet[];
  categories: Category[];
}) {
  const [budgets, setBudgets] = useState<IBudgetClient[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<IBudgetClient | null>(
    null
  );

  // Fetch data
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      toast.error("Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (data: BudgetCreateInput) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newBudget = await response.json();
        setBudgets((prev) => [newBudget, ...prev]);
        setIsCreateDialogOpen(false);
        toast.success(
          `${data.type === "BUDGET" ? "Budget" : "Goal"} created successfully`
        );
      } else {
        toast.error("Failed to create budget");
      }
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  // Edit budget
  const handleEditBudget = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setSelectedBudget(budget);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateBudget = async (data: any) => {
    if (!selectedBudget) return;

    try {
      const response = await fetch(`/api/budgets/${selectedBudget.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedBudget = await response.json();
        setBudgets((prev) =>
          prev.map((b) => (b.id === selectedBudget.id ? updatedBudget : b))
        );
        setIsEditDialogOpen(false);
        setSelectedBudget(null);
        toast.success(
          `${data.type === "BUDGET" ? "Budget" : "Goal"} updated successfully`
        );
      } else {
        toast.error("Failed to update budget");
      }
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  // Delete budget
  const handleDeleteBudget = (budgetId: string) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (budget) {
      setSelectedBudget(budget);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteBudget = async () => {
    if (!selectedBudget) return;

    try {
      const response = await fetch(`/api/budgets/${selectedBudget.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBudgets((prev) => prev.filter((b) => b.id !== selectedBudget.id));
        setIsDeleteDialogOpen(false);
        setSelectedBudget(null);
        toast.success(
          `${
            selectedBudget.type === "BUDGET" ? "Budget" : "Goal"
          } deleted successfully`
        );
      } else {
        toast.error("Failed to delete budget");
      }
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  // Transform budget data for edit form
  const getEditFormData = (budget: IBudgetClient) => {
    return {
      name: budget.name,
      description: budget.description,
      amount: budget.amount,
      type: budget.type,
      period: budget.period as any,
      startDate: budget.startDate,
      endDate: budget.endDate,
      categoryIds: budget.budgetCategories.map((bc) => bc.category.id),
      walletId: budget.wallet?.id,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container w-full max-w-7xl mx-auto p-6">
      <BudgetList
        budgets={budgets}
        onCreateNew={() => setIsCreateDialogOpen(true)}
        onEdit={handleEditBudget}
        onDelete={handleDeleteBudget}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Budget or Goal</DialogTitle>
          </DialogHeader>
          <BudgetForm
            categories={categories}
            wallets={wallets}
            onSubmit={handleCreateBudget}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit {selectedBudget?.type === "BUDGET" ? "Budget" : "Goal"}
            </DialogTitle>
          </DialogHeader>
          {selectedBudget && (
            <BudgetForm
              categories={categories}
              wallets={wallets}
              onSubmit={handleUpdateBudget}
              initialData={getEditFormData(selectedBudget)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedBudget?.type === "BUDGET" ? "Budget" : "Goal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedBudget?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBudget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBudget}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
