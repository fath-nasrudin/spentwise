import { TransactionDateFilterType } from "@/types";
import {
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
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

export const formatDateLabel = (
  type: TransactionDateFilterType,
  date: Date
) => {
  if (type === "day") return format(date, "dd MMM yyyy");
  if (type === "month") return format(date, "MMMM yyyy");
  if (type === "year") return format(date, "yyyy");
  return "Invalid type";
};
