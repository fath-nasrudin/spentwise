"use client";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addMonths,
  addYears,
  format,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TransactionDateFilterType } from "@/types";

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

type Props = {
  filterType: TransactionDateFilterType;
  currentDate: Date;
  onFilterChange: (filterType: TransactionDateFilterType) => void;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
};

export function TransactionDateFilter({
  filterType,
  currentDate,
  onFilterChange,
  onDateChange,
  isLoading,
}: Props) {
  const handlePrev = (): void => {
    const newDate =
      filterType === "day"
        ? subDays(currentDate, 1)
        : filterType === "month"
        ? subMonths(currentDate, 1)
        : subYears(currentDate, 1);

    onDateChange(newDate);
  };
  const handleNext = (): void => {
    const newDate =
      filterType === "day"
        ? addDays(currentDate, 1)
        : filterType === "month"
        ? addMonths(currentDate, 1)
        : addYears(currentDate, 1);

    onDateChange(newDate);
  };

  const formattedLabel = () => {
    if (filterType === "day") return format(currentDate, "dd MMM yyyy");
    if (filterType === "month") return format(currentDate, "MMMM yyyy");
    return format(currentDate, "yyyy");
  };

  const handleFilterChange = (value: string): void => {
    onFilterChange(value as TransactionDateFilterType);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <Select value={filterType} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={isLoading}
      >
        <ChevronLeft />
      </Button>
      <span className="w-[150px] text-center text-sm font-medium">
        {formattedLabel()}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={isLoading}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
