"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createTransaction } from "../transaction.actions";

export default function AddPage() {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"income" | "expense">("expense");

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
      <Input
        type="number"
        placeholder="Nominal"
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
        name="amount"
      />
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
          const formData = new FormData();
          formData.append("amount", amount.toString());
          formData.append("type", type);
          await createTransaction(formData);
        }}
      >
        Simpan
      </Button>
    </div>
  );
}
