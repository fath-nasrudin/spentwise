"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateCategorySchema,
  createCategorySchema,
  UpdateCategorySchema,
} from "./category.schema";
import { revalidatePath } from "next/cache";

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

  const validatedFields = createCategorySchema.safeParse(data);

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
