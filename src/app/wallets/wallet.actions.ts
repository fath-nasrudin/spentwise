"use server";
import { auth } from "@/lib/auth";
import { createWalletSchema, WalletCreateInput } from "./wallet.schema";
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
      message: "Database Error: Failed to create category.",
    };
  }
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
    return { data };
  } catch (error) {
    return { data: [], message: "Something went wrong" };
  }
}
