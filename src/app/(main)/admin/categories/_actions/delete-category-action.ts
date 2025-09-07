"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(id: string) {
  try {
    await prisma.menuCategory.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}
