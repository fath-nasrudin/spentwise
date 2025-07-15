"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WalletCreateInput, createWalletSchema } from "./wallet.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserWallet } from "./wallet.actions";

type CreateWalletReturn = Awaited<ReturnType<typeof createUserWallet>>;

type Props = {
  onSubmit: (
    data: WalletCreateInput
  ) => Promise<Pick<CreateWalletReturn, "errors" | "message" | "success">>;
  initialData?: Partial<WalletCreateInput | null>;
};
export function WalletForm({ onSubmit, initialData }: Props) {
  const form = useForm({
    resolver: zodResolver(createWalletSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: WalletCreateInput) => {
    try {
      const result = await onSubmit(data);

      if (result?.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as "name" | "root" | `root.${string}`, {
            message: messages?.[0],
          });
        });
      } else if (result?.success) {
        console.info(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Name</FormLabel>
              <FormControl>
                <Input placeholder="Wallet Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
