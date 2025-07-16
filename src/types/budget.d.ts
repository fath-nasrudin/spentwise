export interface BudgetFormData {
  name: string;
  description?: string;
  amount: number;
  type: "BUDGET" | "GOAL";
  period: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY" | "CUSTOM";
  startDate: Date;
  endDate?: Date;
  categoryIds: string[];
  walletId?: string;
}

interface IBudgetBase {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: "BUDGET" | "GOAL";
  period: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY" | "CUSTOM";
  startDate: Date;
  endDate?: Date;
  spentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  status: "on_track" | "warning" | "exceeded" | "achieved";
  budgetCategories: Array<{
    category: {
      id: string;
      name: string;
      type: "INCOME" | "EXPENSE";
    };
  }>;
  wallet?: {
    id: string;
    name: string;
  };
}

export type IBudgetCard = IBudgetBase;
export type IBudgetClient = IBudgetBase;
