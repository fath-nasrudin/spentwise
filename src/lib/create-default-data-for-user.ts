import { prisma } from "@/lib/prisma";

export async function createDefaultDataForUser(userId: string) {
  const wallets = ["Main Wallet"];
  const expenseCategories = ["Food", "Transport", "Bills", "Entertainment"];
  const incomeCategories = ["Salary", "Bonus", "Investments"];

  try {
    //   create default wallets
    await prisma.wallet.createMany({
      data: [...wallets.map((w) => ({ name: w, userId }))],
    });

    // create defaut categories
    await prisma.category.createMany({
      data: [
        ...expenseCategories.map((c) => ({
          name: c,
          userId,
          type: "expense" as const,
        })),
        ...incomeCategories.map((c) => ({
          name: c,
          userId,
          type: "income" as const,
        })),
      ],
    });
  } catch (error) {
    console.error(error);
  }
}
