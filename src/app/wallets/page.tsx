import { WalletForm } from "./wallet-form";
import { WalletList } from "./wallet-list";
import { getUserWalletsWithBalance } from "./wallet.actions";

export default async function WalletsPage() {
  const { data: wallets } = await getUserWalletsWithBalance();
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Wallets</h1>
      <WalletForm />
      <WalletList wallets={wallets} />
    </div>
  );
}
