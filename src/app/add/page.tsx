"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { saveTransactions, getTransactions } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export default function AddPage() {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"income" | "expense">("expense");

  function handleSubmit() {
    const tx = {
      id: uuidv4(),
      amount,
      type,
      category: "Misc",
      date: new Date().toISOString(),
    };

    const all = getTransactions();
    saveTransactions([tx, ...all]);
    alert("saved!");
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
      <Input
        type="number"
        placeholder="Nominal"
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
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
      <Button onClick={handleSubmit}>Simpan</Button>
    </div>
  );
}
