import { Transaction } from "@/types";

const KEY = "spentwise";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(tx: Transaction[]) {
  localStorage.setItem(KEY, JSON.stringify(tx));
}
