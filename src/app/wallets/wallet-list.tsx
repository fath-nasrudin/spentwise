import { cn } from "@/lib/utils";
import { Wallet } from "@/generated/prisma";

export function WalletList({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="border hover:border-muted-foreground/60 rounded-md p-2 mb-2"
        >
          <div className={cn("font-medium")}>{wallet.name}</div>
        </div>
      ))}
    </div>
  );
}
