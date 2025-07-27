"use client";

import { QueryClientProvider } from "@/lib/query/client";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
