import { getUserWalletsWithBalance } from "./wallet.actions";
import { WalletsPageClient } from "./page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallets",
};

export default async function WalletsPage() {
  const { data: wallets } = await getUserWalletsWithBalance();

  return <WalletsPageClient wallets={wallets} />;
}
