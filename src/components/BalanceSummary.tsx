import { getTransactions } from "@/actions/transaction.actions";
import { cn } from "@/lib/utils";

export default async function BalanceSummary() {
  const tx = await getTransactions();
  const balance = tx.reduce((acc, t) => {
    return acc + (t.type === "income" ? t.amount : -t.amount);
  }, 0);

  return (
    <div className={cn("text-xl font-bold")}>
      Saldo:{" "}
      <span
        className={cn("text-xl font-bold", {
          "text-red-600": balance < 0,
          "text-green-600": balance >= 0,
        })}
      >
        {" "}
        {balance < 0 ? "-" : "+"}Rp{Math.abs(balance).toLocaleString("us-US")}
      </span>
    </div>
  );
}
