"use client";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { useState, useEffect, useCallback } from "react";
import {
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
import { getUserTransactions } from "./transaction.actions";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FilterType = "day" | "month" | "year";

export function getDateRange(type: "day" | "month" | "year", baseDate: Date) {
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

type Props<T> = {
  onFilter: (filtered: T[]) => void;
};

export function TransactionDateFilter<T>({ onFilter }: Props<T>) {
  const [filterType, setFilterType] = useState<FilterType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (type: FilterType, date: Date) => {
    setIsLoading(true);
    try {
      const range = getDateRange(type, date);
      const { data } = await getUserTransactions({ where: { date: range } });
      onFilter(data as T[]);
    } catch (err) {
      console.error("Gagal fetch transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filterType, currentDate);
  }, [filterType, currentDate]);

  const handlePrev = () => {
    setCurrentDate((prev) =>
      filterType === "day"
        ? subDays(prev, 1)
        : filterType === "month"
        ? subMonths(prev, 1)
        : subYears(prev, 1)
    );
  };

  const handleNext = () => {
    setCurrentDate((prev) =>
      filterType === "day"
        ? addDays(prev, 1)
        : filterType === "month"
        ? addMonths(prev, 1)
        : addYears(prev, 1)
    );
  };

  const formattedLabel = () => {
    if (filterType === "day") return format(currentDate, "dd MMM yyyy");
    if (filterType === "month") return format(currentDate, "MMMM yyyy");
    return format(currentDate, "yyyy");
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <Select
        value={filterType}
        onValueChange={(val: FilterType) => setFilterType(val)}
      >
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
