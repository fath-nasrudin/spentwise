"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  CheckCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BudgetDashboardProps {
  budgets: Array<{
    id: string;
    name: string;
    type: "BUDGET" | "GOAL";
    amount: number;
    spentAmount: number;
    progressPercentage: number;
    status: "on_track" | "warning" | "exceeded" | "achieved";
    endDate?: Date;
  }>;
}

export function BudgetDashboard({ budgets }: BudgetDashboardProps) {
  const budgetStats = budgets.reduce(
    (acc, budget) => {
      if (budget.type === "BUDGET") {
        acc.totalBudgets += 1;
        acc.totalBudgetAmount += budget.amount;
        acc.totalSpent += budget.spentAmount;
        if (budget.status === "exceeded") acc.overBudget += 1;
        if (budget.status === "warning") acc.nearLimit += 1;
      } else {
        acc.totalGoals += 1;
        acc.totalGoalAmount += budget.amount;
        acc.totalSaved += budget.spentAmount;
        if (budget.status === "achieved") acc.goalsAchieved += 1;
      }
      return acc;
    },
    {
      totalBudgets: 0,
      totalBudgetAmount: 0,
      totalSpent: 0,
      overBudget: 0,
      nearLimit: 0,
      totalGoals: 0,
      totalGoalAmount: 0,
      totalSaved: 0,
      goalsAchieved: 0,
    }
  );

  const upcomingDeadlines = budgets
    .filter((b) => b.endDate && b.type === "GOAL" && b.status !== "achieved")
    .sort(
      (a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime()
    )
    .slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Budget Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budgets</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{budgetStats.totalBudgets}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {budgetStats.overBudget} over budget, {budgetStats.nearLimit} near
            limit
          </div>
        </CardContent>
      </Card>

      {/* Spending Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(budgetStats.totalSpent)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            of {formatCurrency(budgetStats.totalBudgetAmount)} budgeted
          </div>
        </CardContent>
      </Card>

      {/* Goals Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{budgetStats.totalGoals}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {budgetStats.goalsAchieved} achieved
          </div>
        </CardContent>
      </Card>

      {/* Savings Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(budgetStats.totalSaved)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            of {formatCurrency(budgetStats.totalGoalAmount)} target
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Goal Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{goal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(goal.spentAmount)} of{" "}
                        {formatCurrency(goal.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress
                      value={goal.progressPercentage}
                      className="w-20"
                    />
                    <Badge
                      variant={
                        goal.status === "warning" ? "destructive" : "secondary"
                      }
                    >
                      {goal.endDate && format(new Date(goal.endDate), "MMM d")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
