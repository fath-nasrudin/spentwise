"use server";

import { signIn } from "@/lib/auth";

export const loginAction = async ({ callbackUrl }: { callbackUrl: string }) => {
  await signIn("google", { redirectTo: callbackUrl });
};
