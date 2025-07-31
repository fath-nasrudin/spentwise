"use server";
import { auth } from "@/lib/auth";
import {
  createWalletSchema,
  updateWalletSchema,
  WalletCreateInput,
  WalletUpdateInput,
} from "./wallet.schema";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUserWallet(data: WalletCreateInput) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please Login First" };
  }

  const validatedFields = createWalletSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.wallet.create({
      data: {
        name: validatedFields.data.name,
        userId: session.user.id,
      },
    });

    revalidatePath("/wallets");
    return {
      success: true,
      message: "Wallet created",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create wallet.",
    };
  }
}

export async function updateUserWallet(id: string, data: WalletUpdateInput) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  const validatedFields = updateWalletSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const updated = await prisma.wallet.update({
    where: { id },
    data: validatedFields.data,
  });

  revalidatePath("/wallets");
  return { success: true, data: updated };
}

export async function deleteUserWallet(id: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please login first" };
  }

  const deleted = await prisma.wallet.delete({ where: { id } });
  revalidatePath("/wallets");
  return {
    success: true,
    data: deleted,
    message: "Success delete the wallet",
  };
}

export async function getUserWallets() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { data: [], message: "Unauthorized. Please login first" };
    }

    const data = await prisma.wallet.findMany({
      where: { userId: session.user.id },
    });
    return { data, success: true };
  } catch (_) {
    return { data: [], message: "Something went wrong" };
  }
}

export async function getUserWalletsWithBalance() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { data: [], message: "Unauthorized. Please login first" };
    }
    const userId = session.user.id;

    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    });

    const balances = await prisma.transaction.groupBy({
      by: ["walletId", "type"],
      _sum: {
        amount: true,
      },
      where: {
        wallet: {
          userId: userId,
        },
      },
    });

    const walletBalances: Record<string, number> = {};

    for (const row of balances) {
      const walletId = row.walletId;
      const amount = row._sum.amount ?? 0;

      if (!(walletId in walletBalances)) {
        walletBalances[walletId] = 0;
      }

      if (row.type === "income") walletBalances[walletId] += amount;
      else if (row.type === "expense") walletBalances[walletId] -= amount;
    }

    const data = wallets.map((wallet) => ({
      id: wallet.id,
      name: wallet.name,
      balance: walletBalances[wallet.id] ?? 0,
    }));

    return { data, success: true };
  } catch (_) {
    return { data: [], message: "Something went wrong" };
  }
}
