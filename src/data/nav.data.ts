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
      url: "/categories",
      icon: TagsIcon,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: ArrowLeftRightIcon,
    },
    {
      title: "Wallets",
      url: "/wallets",
      icon: WalletIcon,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: GoalIcon,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
}
