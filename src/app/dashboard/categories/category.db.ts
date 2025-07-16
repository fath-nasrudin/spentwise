import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserCategories() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error("Unauthorized. Please login first");
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
    });
    return { data: categories, error: null };
  } catch (error) {
    return { data: [], error };
  }
}
