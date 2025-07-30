import { TransactionDateFilterType } from "@/types";
import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";

export function getDateRange(type: TransactionDateFilterType, baseDate: Date) {
  if (type === "day") {
    return {
      gte: startOfDay(baseDate),
      lte: endOfDay(baseDate),
    };
  }
  if (type === "month") {
    return {
      gte: startOfMonth(baseDate),
      lte: endOfMonth(baseDate),
    };
  }
  return {
    gte: startOfYear(baseDate),
    lte: endOfYear(baseDate),
  };
}
