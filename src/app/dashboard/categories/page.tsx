import { Metadata } from "next";
import { CategoriesPageClient } from "./page.client";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  return <CategoriesPageClient />;
}
