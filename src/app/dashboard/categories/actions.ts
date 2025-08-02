"use server";

export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateCategorySchema,
  createCategorySchema,
  updateCategorySchema,
  UpdateCategorySchema,
} from "./category.schema";
import { revalidatePath } from "next/cache";

export async function getUserCategories() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized. Please login first");
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
    });
    return { data: categories, error: null, success: true };
  } catch (error) {
    return { data: [], error, message: "Something went wrong" };
  }
}

export async function createCategory(data: CreateCategorySchema) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please Login First" };
  }

  const validatedFields = createCategorySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: validatedFields.data.name,
        type: validatedFields.data.type,
        userId: session.user.id,
      },
    });
    revalidatePath("/categories");
    return { success: true, message: "Success create category" };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create category.",
    };
  }
}

export async function updateCategory(id: string, data: UpdateCategorySchema) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please Login First" };
  }

  const validatedFields = updateCategorySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.category.update({
      where: {
        id,
      },
      data: {
        ...validatedFields,
        userId: session.user.id,
      },
    });
    revalidatePath("/categories");
    return { success: true, message: "Category successfully updated!" };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Update category.",
    };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { message: "Unauthorized. Please Login First" };
  }

  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/categories");
    return { success: true, message: "Category successfully deleted!" };
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to delete category.",
    };
  }
}
