import {
  ArrowLeftRightIcon,
  GoalIcon,
  Settings,
  TagsIcon,
  WalletIcon,
} from "lucide-react";

export function getSidebarMenu() {
  return [
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: TagsIcon,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: ArrowLeftRightIcon,
    },
    {
      title: "Wallets",
      url: "/dashboard/wallets",
      icon: WalletIcon,
    },
    {
      title: "Budgets",
      url: "/dashboard/budgets",
      icon: GoalIcon,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
}
