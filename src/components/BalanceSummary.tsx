"use client";
import { getTransactions } from "@/lib/storage";

export default function BalanceSummary() {
  const tx = getTransactions();
  const balance = tx.reduce((acc, t) => {
    return acc + (t.type === "income" ? t.amount : -t.amount);
  }, 0);

  return <div className="text-xl font-bold">Saldo: Rp{balance}</div>;
}
