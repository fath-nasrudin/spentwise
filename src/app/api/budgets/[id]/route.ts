import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/budgets/[id] - Get single budget with spending data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const budgetId = (await params).id;
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId,
    },
    include: {
      wallet: true,
    },
  });

  if (!budget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  const budgetCategories = await prisma.budgetCategory.findMany({
    where: {
      budgetId,
    },
    include: {
      category: {
        include: {
          transactions: {
            where: {
              createdAt: {
                gte: new Date(budget.startDate),
                lte: budget.endDate ? new Date(budget.endDate) : new Date(),
              },
            },
          },
        },
      },
    },
  });

  // Calculate spent amount
  const spentAmount = budgetCategories.reduce((total, bc) => {
    const categorySpent = bc.category.transactions.reduce((sum, t) => {
      return sum + (t.type === "expense" ? Number(t.amount) : 0);
    }, 0);
    return total + categorySpent;
  }, 0);

  return NextResponse.json({
    ...budget,
    budgetCategories,
    spentAmount,
    remainingAmount: Number(budget.amount) - spentAmount,
    progressPercentage: (spentAmount / Number(budget.amount)) * 100,
  });
}

// PUT /api/budgets/[id] - Update budget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json();
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { categoryIds, ...budgetData } = body;

  const budget = await prisma.budget.update({
    where: {
      id: (await params).id,
      userId,
    },
    data: {
      ...budgetData,
      budgetCategories: {
        deleteMany: {}, // Remove existing categories
        create: categoryIds.map((categoryId: string) => ({
          categoryId,
        })),
      },
    },
    include: {
      budgetCategories: {
        include: {
          category: true,
        },
      },
      wallet: true,
    },
  });

  return NextResponse.json(budget);
}

// DELETE /api/budgets/[id] - Delete budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  await prisma.budget.delete({
    where: {
      id: (await params).id,
      userId,
    },
  });

  return NextResponse.json({ success: true });
}
