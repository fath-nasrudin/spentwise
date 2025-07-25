import { PrismaClient } from "@/generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const [wallets, categories, user] = await Promise.all([
    prisma.wallet.findMany(),
    prisma.category.findMany(),
    prisma.user.findFirst(),
  ]);

  if (!user) throw new Error("User not found. Create first!");
  if (!wallets.length) throw new Error("Wallet not found. Create first!");
  if (!categories) throw new Error("Categories not found. Create first!");

  // create 100 dummy transactions
  const transactionsData = Array.from({ length: 100 }).map(() => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const wallet = wallets[Math.floor(Math.random() * wallets.length)];

    return {
      userId: user!.id,
      categoryId: category.id,
      walletId: wallet.id,
      type: category.type,
      amount: faker.number.int({ min: 10000, max: 1000000 }),
      note: faker.commerce.productName(),
      date: faker.date.between({
        from: new Date("2025-01-01"),
        to: new Date(),
      }),
    };
  });

  await prisma.transaction.createMany({ data: transactionsData });

  console.log("✅ Done seeding: user, wallets, categories, transactions");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
