"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "../../components/DatePicker";
import { useForm } from "react-hook-form";
import {
  createTransactionSchema,
  CreateTransactionSchema,
} from "@/app/transactions/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserTransaction } from "@/app/transactions/transaction.actions";
import { Category, Wallet } from "@/generated/prisma";
import { useEffect, useState } from "react";

type AddTransactionFormProps = { categories: Category[]; wallets: Wallet[] };

export function AddTransactionForm({
  categories,
  wallets,
}: AddTransactionFormProps) {
  const form = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      type: "expense",
      categoryId: "",
      note: "",
      walletId: "",
    },
  });

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const type = form.watch("type");
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.type === type);
    setFilteredCategories(filtered);
    form.setValue("categoryId", "");
  }, [type, categories, form]);

  async function onSubmit(data: CreateTransactionSchema) {
    try {
      const result = await createUserTransaction(data);
      if (result?.message) {
        console.info(result.message);
      } else {
        console.info("Submitted");
      }
    } catch (error) {
      console.error("Error happened", error);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    {wallets?.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </SelectItem>
                    ))}
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
                    {filteredCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
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
