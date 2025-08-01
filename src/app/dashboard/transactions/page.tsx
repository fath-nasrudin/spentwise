import { Metadata } from "next";
import { TransactionsPageClient } from "./page.client";

export const metadata: Metadata = {
  title: "Transactions",
};

export default async function TransactionsPage() {
  return <TransactionsPageClient />;
}
