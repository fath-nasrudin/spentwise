"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "../DatePicker";
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
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/actions/transaction.actions";
import { Category } from "@/generated/prisma";
import { useEffect, useState } from "react";

export function AddTransactionForm({ categories }: { categories: Category[] }) {
  const form = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 1,
      date: new Date(),
      type: "expense",
      category: "",
      note: "",
    },
  });

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const type = form.watch("type");
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.type === type);
    setFilteredCategories(filtered);
    form.setValue("category", "");
  }, [type, categories, form]);

  async function onSubmit(data: CreateTransactionSchema) {
    try {
      const result = await createTransaction(data);
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

          <FormField
            control={form.control}
            name="category"
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
