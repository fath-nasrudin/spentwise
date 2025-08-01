import { WalletsPageClient } from "./page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallets",
};

export default async function WalletsPage() {
  return <WalletsPageClient />;
}
