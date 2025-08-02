"use client";

import { useGetTransactionsSummary } from "@/app/dashboard/transactions/hooks/use-transactions";
import { cn } from "@/lib/utils";

export default function BalanceSummary() {
  const { data, isError, isLoading } = useGetTransactionsSummary({
    by: ["type"],
  });

  if (isError) {
    return <p>Something went wrong</p>;
  }

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );

  if (!data) return <p>No data available</p>;

  const balance = data.reduce((prev, current) => {
    if (current.type === "income") prev += current.total || 0;
    if (current.type === "expense") prev -= current.total || 0;
    return prev;
  }, 0);

  console.log({ balance, data });

  return (
    <div className={cn("text-xl font-bold")}>
      Saldo:{" "}
      <span
        className={cn("text-xl font-bold", {
          "text-red-600": balance < 0,
          "text-green-600": balance >= 0,
        })}
      >
        {" "}
        {balance < 0 ? "-" : "+"}Rp{Math.abs(balance).toLocaleString("us-US")}
      </span>
    </div>
  );
}
