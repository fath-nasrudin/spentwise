"use server";

import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from "@/app/dashboard/transactions/transaction.schema";
import { Prisma } from "@/generated/prisma";
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
  return { success: true };
}

export async function updateUserTransaction(
  id: string,
  data: UpdateTransactionSchema
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  const updated = await prisma.transaction.update({ where: { id }, data });
  revalidatePath("/transactions");
  return { success: true, data: updated };
}

export async function deleteUserTransaction(id: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  const deleted = await prisma.transaction.delete({ where: { id } });
  revalidatePath("/transactions");
  return {
    success: true,
    data: deleted,
    message: "Success delete the transaction",
  };
}

export async function getUserTransactions(
  options?: Pick<Prisma.TransactionFindManyArgs, "where">
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { data: [], message: "Unauthorized. Please login first" };
  }
  const userId = session.user.id;

  const transactions = await prisma.transaction.findMany({
    where: { ...options?.where, userId },
    orderBy: { date: "desc" },
    include: {
      category: {
        select: { name: true, id: true },
      },
      wallet: {
        select: { name: true, id: true },
      },
    },
  });
  return { data: transactions, success: true };
}

export async function getUserTransactionsSummary(
  options?: Partial<Pick<Prisma.TransactionGroupByArgs, "where" | "by">>
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { data: [], message: "Unauthorized. Please login first" };
  }
  const userId = session.user.id;

  const transactions = await prisma.transaction.groupBy({
    by: options?.by || ["type"],
    where: { ...options?.where, userId },
    _sum: {
      amount: true,
    },
  });

  const flattedTransactions = transactions.map((tx) => {
    return {
      type: tx.type,
      total: tx._sum.amount,
    };
  });

  return { data: flattedTransactions, success: true };
}
