import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Spentwise - Track your money",
    template: "%s | Spentwise",
  },
  description: "Track and budgets all of your money",
  keywords: [
    "money tracker",
    "expense tracker",
    "money manager",
    "budgeting",
    "budget money",
  ],
  authors: [
    { name: "Fathurrohman Nasrudin", url: "https://github.com/fath-nasrudin" },
  ],
  metadataBase: new URL("https://spentwise.vercel.app"),
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
