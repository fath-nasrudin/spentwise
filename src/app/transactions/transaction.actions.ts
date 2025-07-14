"use server";

import { CreateTransactionSchema } from "@/app/transactions/transaction.schema";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUserTransaction(data: CreateTransactionSchema) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  await prisma.transaction.create({
    data: { ...data, userId: session.user.id },
  });
  revalidatePath("/transactions");
}

export async function getUserTransactions() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { data: [], message: "Unauthorized. Please login first" };
  }
  const userId = session.user.id;

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return { data: transactions };
}
