import { prisma } from "@/lib/prisma";

export interface BudgetProgress {
  spent: number;
  remaining: number;
  percentage: number;
  status: "on_track" | "warning" | "exceeded" | "achieved";
}

export async function calculateBudgetProgress(
  budgetId: string,
  startDate: Date,
  endDate?: Date
): Promise<BudgetProgress> {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      budgetCategories: {
        include: {
          category: {
            include: {
              transactions: {
                where: {
                  createdAt: {
                    gte: startDate,
                    ...(endDate && { lte: endDate }),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!budget) throw new Error("Budget not found");

  const spent = budget.budgetCategories.reduce((total, bc) => {
    const categorySpent = bc.category.transactions.reduce(
      (sum, transaction) => {
        if (budget.type === "BUDGET" && transaction.type === "expense") {
          return sum + Number(transaction.amount);
        } else if (budget.type === "GOAL" && transaction.type === "income") {
          return sum + Number(transaction.amount);
        }
        return sum;
      },
      0
    );
    return total + categorySpent;
  }, 0);

  const targetAmount = Number(budget.amount);
  const remaining = targetAmount - spent;
  const percentage = (spent / targetAmount) * 100;

  let status: BudgetProgress["status"];
  if (budget.type === "BUDGET") {
    if (percentage >= 100) status = "exceeded";
    else if (percentage >= 80) status = "warning";
    else status = "on_track";
  } else {
    if (percentage >= 100) status = "achieved";
    else if (percentage >= 80) status = "warning";
    else status = "on_track";
  }

  return {
    spent,
    remaining,
    percentage,
    status,
  };
}

export function getDateRangeForPeriod(
  period: string,
  startDate: Date
): {
  start: Date;
  end: Date;
} {
  const start = new Date(startDate);
  const end = new Date(startDate);

  switch (period) {
    case "WEEKLY":
      end.setDate(start.getDate() + 7);
      break;
    case "MONTHLY":
      end.setMonth(start.getMonth() + 1);
      break;
    case "QUARTERLY":
      end.setMonth(start.getMonth() + 3);
      break;
    case "YEARLY":
      end.setFullYear(start.getFullYear() + 1);
      break;
    default:
      // For CUSTOM, endDate should be provided separately
      break;
  }

  return { start, end };
}

export function getBudgetStatusColor(status: BudgetProgress["status"]): string {
  switch (status) {
    case "on_track":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "exceeded":
      return "text-red-600";
    case "achieved":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

export function getBudgetStatusText(
  status: BudgetProgress["status"],
  type: "BUDGET" | "GOAL"
): string {
  if (type === "BUDGET") {
    switch (status) {
      case "on_track":
        return "On Track";
      case "warning":
        return "Near Limit";
      case "exceeded":
        return "Over Budget";
      default:
        return "Unknown";
    }
  } else {
    switch (status) {
      case "on_track":
        return "In Progress";
      case "warning":
        return "Almost There";
      case "achieved":
        return "Goal Achieved!";
      default:
        return "Unknown";
    }
  }
}
