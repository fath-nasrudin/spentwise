"use client";
import { QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "./query-client";
import { QueryClientProvider as QueryProvider } from "@tanstack/react-query";

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

const queryClient = getQueryClient();

export function QueryClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
}
