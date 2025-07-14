"use server";

import { CreateTransactionSchema } from "@/app/transactions/transaction.schema";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction(data: CreateTransactionSchema) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  await prisma.transaction.create({
    data: { ...data, userId: session.user.id },
  });
  revalidatePath("/transactions");
}

export async function getTransactions() {
  return await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
}
