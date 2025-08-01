"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "../../../../components/DatePicker";
import { useForm } from "react-hook-form";
import {
  createTransactionSchema,
  CreateTransactionSchema,
} from "@/app/dashboard/transactions/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { Transaction } from "@/types";
import { useGetWallets } from "../../wallets/hooks/use-wallets";
import { useGetCategories } from "../../categories/hooks/use-categories";

type TransactionFormProps = {
  onSubmit: (data: CreateTransactionSchema) => void;
  initialData?: Partial<Transaction | null>;
};

export function TransactionForm({
  onSubmit,
  initialData,
}: TransactionFormProps) {
  const walletsQuery = useGetWallets();
  const categoriesQuery = useGetCategories();
  const { data: categories } = useGetCategories();

  const form = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date(),
      type: initialData?.type || "expense",
      categoryId: initialData?.categoryId || "",
      note: initialData?.note || "",
      walletId: initialData?.walletId || "",
    },
  });

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const type = form.watch("type");

  useEffect(() => {
    if (!categories) return;
    const filtered = categories.filter((cat) => cat.type === type);
    setFilteredCategories(filtered);

    // if the current categoryId NOT APPEAR in filteredCategories, reset it
    if (!filtered.find((c) => c.id === form.getValues("categoryId"))) {
      form.setValue("categoryId", "");
    }
  }, [type, categories, form]);

  function handleSubmit(data: CreateTransactionSchema) {
    onSubmit(data);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Amount"
                    {...field}
                    type="number"
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Note"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">income</SelectItem>
                    <SelectItem value="expense">expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* wallets */}
          <FormField
            control={form.control}
            name="walletId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Wallet</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="wallet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {walletsQuery.isLoading ? (
                      <SelectItem value="loading">Loading..</SelectItem>
                    ) : walletsQuery.isError ? (
                      <SelectItem value="error">
                        Something went wrong
                      </SelectItem>
                    ) : !walletsQuery.data ? (
                      <SelectItem value="notfound">Data not found</SelectItem>
                    ) : (
                      walletsQuery.data?.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesQuery.isLoading ? (
                      <SelectItem value="loading">Loading..</SelectItem>
                    ) : categoriesQuery.isError ? (
                      <SelectItem value="error">
                        Something went wrong
                      </SelectItem>
                    ) : !categoriesQuery.data ? (
                      <SelectItem value="notfound">Data not found</SelectItem>
                    ) : (
                      filteredCategories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Type</FormLabel>
                <FormControl>
                  <DatePicker
                    value={new Date(field.value as string)}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Simpan</Button>
        </form>
      </Form>
    </div>
  );
}
