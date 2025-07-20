import { BudgetPeriod } from "@/generated/prisma";

interface GetBudgetPeriodRangeOptions {
  startDate: Date;
  period: BudgetPeriod;
  customEndDate?: Date | null;
}

export function getBudgetPeriodRange({
  startDate,
  period,
  customEndDate,
}: GetBudgetPeriodRangeOptions) {
  const start = new Date(startDate); // clone to avoid mutation
  let end: Date;

  switch (period) {
    case BudgetPeriod.WEEKLY:
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;

    case BudgetPeriod.MONTHLY:
      end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      end.setDate(end.getDate() - 1);
      break;

    case BudgetPeriod.QUARTERLY:
      end = new Date(start);
      end.setMonth(start.getMonth() + 3);
      end.setDate(end.getDate() - 1);
      break;

    case BudgetPeriod.YEARLY:
      end = new Date(start);
      end.setFullYear(start.getFullYear() + 1);
      end.setDate(end.getDate() - 1);
      break;

    case BudgetPeriod.CUSTOM:
      if (!customEndDate) {
        throw new Error("customEndDate is required for CUSTOM period");
      }
      end = new Date(customEndDate);
      break;

    default:
      throw new Error("Invalid BudgetPeriod");
  }

  return {
    startDate: start,
    endDate: end,
  };
}
