"use client";
import { useGetTransactionsSummary } from "../hooks/use-transactions";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  total: {
    label: "Total",
  },
  income: {
    label: "Income",
    color: "var(--color-green-500)",
  },
  expense: {
    label: "Outcome",
    color: "var(--color-red-500)",
  },
} satisfies ChartConfig;

function TransactionSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function TransactionSummaryCard({
  dateRange,
  label = "Summary",
}: {
  dateRange: { gte: Date; lte: Date };
  label?: string;
}) {
  const transactionsSummary = useGetTransactionsSummary({
    where: { date: dateRange },
    by: ["type"],
  });

  if (transactionsSummary.isError) {
    return <p>Something went wrong</p>;
  }

  if (transactionsSummary.isLoading) return <TransactionSummarySkeleton />;

  if (!transactionsSummary.data) return <p>No data available</p>;

  const chartData2 = transactionsSummary.data.map((tx) => {
    return {
      ...tx,
      fill: `var(--color-${tx.type})`,
    };
  });

  const grandTotal = transactionsSummary.data.reduce((prev, current) => {
    if (current.type === "income") {
      prev += current.total || 0;
    } else {
      prev -= current.total || 0;
    }
    return prev;
  }, 0);

  return (
    <div className=" border rounded-md py-2 px-4 max-w-sm">
      <h2 className="font-semibold text-center">Summary</h2>
      <h2 className="text-sm font-semibold">{label}</h2>
      <div className="flex flex-col sm:flex-row  sm:gap-24">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square h-24"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="type" hideLabel />}
            />
            <Pie
              data={chartData2}
              dataKey="total"
              innerRadius={18}
              outerRadius={36}
            ></Pie>
          </PieChart>
        </ChartContainer>
        <div>
          <Table>
            <TableBody>
              {chartData2.map((data) => (
                <TableRow key={data.type} className="font-semibold">
                  <TableCell>{data.type}</TableCell>
                  <TableCell>{formatCurrency(data.total || 0)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold">
                <TableCell>Total</TableCell>
                <TableCell>{formatCurrency(grandTotal || 0)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
