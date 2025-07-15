"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategory } from "./actions";
import { CreateCategorySchema, createCategorySchema } from "./category.schema";

export function CategoryForm() {
  // 1. Define your form.
  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: "expense",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CreateCategorySchema) {
    try {
      const result = await createCategory(values);

      if (result?.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as keyof typeof values, {
            message: messages?.[0],
          });
        });
      } else if (result?.message) {
        console.error(result.message);
      } else {
        console.info("Category created successfully!");
        // redirect akan di-handle oleh server action
      }
    } catch (_) {
      console.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Food" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Category type" />
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
