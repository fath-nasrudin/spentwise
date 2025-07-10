"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createTransaction } from "@/actions/transaction.actions";
import { DatePicker } from "../DatePicker";

export function AddTransactionForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        name="amount"
      />
      <DatePicker value={date} onChange={setDate} />
      <div className="flex gap-2 my-2">
        <Button
          variant={type === "expense" ? "default" : "outline"}
          onClick={() => setType("expense")}
        >
          Pengeluaran
        </Button>
        <Button
          variant={type === "income" ? "default" : "outline"}
          onClick={() => setType("income")}
        >
          Pemasukan
        </Button>
      </div>
      <Button
        onClick={async () => {
          console.log({ date });
          const formData = new FormData();
          formData.append("amount", amount.toString());
          formData.append("type", type);
          formData.append("date", date?.toISOString() || "");
          await createTransaction(formData);
        }}
      >
        Simpan
      </Button>
    </div>
  );
}
