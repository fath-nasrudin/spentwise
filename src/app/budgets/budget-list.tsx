"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Target, TrendingUp } from "lucide-react";
import { BudgetCard } from "./budget-card";
import { IBudgetCard } from "@/types/budget";

interface BudgetListProps {
  budgets: IBudgetCard[];
  onCreateNew?: () => void;
  onEdit?: (budgetId: string) => void;
  onDelete?: (budgetId: string) => void;
}

export function BudgetList({
  budgets,
  onCreateNew,
  onEdit,
  onDelete,
}: BudgetListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "budgets" && budget.type === "BUDGET") ||
      (activeTab === "goals" && budget.type === "GOAL");

    return matchesSearch && matchesTab;
  });

  const budgetCounts = {
    all: budgets.length,
    budgets: budgets.filter((b) => b.type === "BUDGET").length,
    goals: budgets.filter((b) => b.type === "GOAL").length,
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budgets & Goals</h1>
          <p className="text-muted-foreground">
            Track your spending limits and savings targets
          </p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search budgets and goals..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary" className="ml-1">
              {budgetCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Budgets
            <Badge variant="secondary" className="ml-1">
              {budgetCounts.budgets}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
            <Badge variant="secondary" className="ml-1">
              {budgetCounts.goals}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredBudgets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No budgets or goals found
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm
                    ? "Try a different search term"
                    : "Create your first budget or goal to get started"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={onCreateNew}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
