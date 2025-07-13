"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Target,
  TrendingUp,
  Wallet,
  Edit,
  Trash2,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IBudgetCard } from "@/types/budget";

interface BudgetCardProps {
  budget: IBudgetCard;
  onEdit?: (budgetId: string) => void;
  onDelete?: (budgetId: string) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const [budgetDetail, setBudgetDetail] = useState<
    BudgetCardProps["budget"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const fetchBudgetDetail = async () => {
    try {
      const response = await fetch(`/api/budgets/${budget.id}`);
      if (response.ok) {
        const data = await response.json();
        setBudgetDetail(data);
      }
    } catch (error) {
      toast.error("Failed to fetch budget detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBudgetDetail();
  }, []);

  if (!budgetDetail || loading) {
    return <p>Loading...</p>;
  }

  const getStatusIcon = () => {
    switch (budgetDetail?.status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "exceeded":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (budgetDetail?.status) {
      case "achieved":
        return "bg-green-100 text-green-800";
      case "exceeded":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getProgressColor = () => {
    switch (budgetDetail?.status) {
      case "achieved":
        return "bg-green-500";
      case "exceeded":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusText = () => {
    if (budgetDetail.type === "BUDGET") {
      switch (budgetDetail?.status) {
        case "on_track":
          return "On Track";
        case "warning":
          return "Near Limit";
        case "exceeded":
          return "Over Budget";
        default:
          return "Unknown";
      }
    } else {
      switch (budgetDetail.status) {
        case "on_track":
          return "In Progress";
        case "warning":
          return "Almost There";
        case "achieved":
          return "Goal Achieved!";
        default:
          return "Unknown";
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {budgetDetail?.type === "BUDGET" ? (
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Target className="h-4 w-4 text-muted-foreground" />
          )}
          <CardTitle className="text-lg font-semibold">
            {budgetDetail?.name}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(budgetDetail?.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(budgetDetail?.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Description */}
          {budgetDetail?.description && (
            <p className="text-sm text-muted-foreground">
              {budgetDetail?.description}
            </p>
          )}

          {/* Amount Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">
                {budgetDetail?.type === "BUDGET" ? "Spent" : "Progress"}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(budgetDetail?.spentAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">
                {budgetDetail?.type === "BUDGET" ? "Budget" : "Target"}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(budgetDetail?.amount)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {budgetDetail?.progressPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={Math.min(budgetDetail?.progressPercentage, 100)}
              className={cn("w-full")}
              innerClassName={getProgressColor()}
            />
          </div>

          {/* Remaining Amount */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {budgetDetail?.type === "BUDGET" ? "Remaining" : "To Go"}
            </span>
            <span
              className={`text-sm font-semibold ${
                budgetDetail?.remainingAmount < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {formatCurrency(Math.abs(budgetDetail?.remainingAmount))}
              {budgetDetail?.remainingAmount < 0 && " over"}
            </span>
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm font-medium mb-2">Categories</p>
            <div className="flex flex-wrap gap-1">
              {budgetDetail.budgetCategories.map((bc) => (
                <Badge
                  key={bc.category.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {bc.category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Wallet */}
          {budgetDetail?.wallet && (
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {budgetDetail?.wallet.name}
              </span>
            </div>
          )}

          {/* Period */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Period: {budgetDetail?.period}</span>
            <span>
              {format(budgetDetail?.startDate, "MMM d")} -{" "}
              {budgetDetail?.endDate
                ? format(budgetDetail?.endDate, "MMM d, yyyy")
                : "Ongoing"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
