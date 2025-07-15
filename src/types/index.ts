export * from "./transaction";
import { getUserCategories } from "@/app/categories/category.db";

export type Category = Awaited<ReturnType<typeof getUserCategories>>["data"][0];
