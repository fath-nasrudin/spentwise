export type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  date: string; // ISO string
};
