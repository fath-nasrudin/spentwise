"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  const amount = Number(formData.get("amount"));
  const type = formData.get("type") as "income" | "expense";
  const category = (formData.get("category") as string) || "Misc";
  const note = formData.get("note") as string;
  const date = formData.get("date") as string;

  if (!amount || !type) {
    throw new Error("Amount dan type harus diisi");
  }

  await prisma.transaction.create({
    data: {
      amount,
      type,
      category,
      note,
      date: new Date(date),
      userId: session.user.id,
    },
  });

  revalidatePath("/transactions");
}

export async function getTransactions() {
  return await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
}
