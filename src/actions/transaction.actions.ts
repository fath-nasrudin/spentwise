"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const type = formData.get("type") as "income" | "expense";
  const category = (formData.get("category") as string) || "Misc";
  const note = formData.get("note") as string;
  const date = formData.get("date") as string;

  if (!amount || !type) {
    throw new Error("Amount dan type harus diisi");
  }

  await prisma.transaction.create({
    data: { amount, type, category, note, date: new Date(date) },
  });

  revalidatePath("/transactions");
}

export async function getTransactions() {
  return await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
}
