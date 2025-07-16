import { getUserWalletsWithBalance } from "./wallet.actions";
import { WalletsPageClient } from "./page.client";

export default async function WalletsPage() {
  const { data: wallets } = await getUserWalletsWithBalance();

  return <WalletsPageClient wallets={wallets} />;
}
