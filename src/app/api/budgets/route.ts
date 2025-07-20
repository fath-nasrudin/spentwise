import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/budgets - List all budgets/goals
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "BUDGET" | "GOAL"; // 'BUDGET' or 'GOAL'

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      ...(type && { type }),
      isActive: true,
    },
    include: {
      budgetCategories: {
        include: {
          category: true,
        },
      },
      wallet: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(budgets);
}
// POST /api/budgets - Create new budget/goal
import { createBudgetSchema } from "@/app/dashboard/budgets/budget.schema";
import { getBudgetPeriodRange } from "./get-budget-period-range";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const parseResult = createBudgetSchema.safeParse(body);
  if (!parseResult.success) {
    console.log(parseResult.error.flatten().fieldErrors);
    return NextResponse.json(
      {
        error: "Invalid input",
        errors: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }
  const { categoryIds, ...budgetData } = parseResult.data;
  const periodRange = getBudgetPeriodRange({
    startDate: budgetData.startDate,
    period: budgetData.period,
    customEndDate: budgetData.endDate,
  });

  const budget = await prisma.budget.create({
    data: {
      ...budgetData,
      ...periodRange,
      userId,
      budgetCategories: {
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
