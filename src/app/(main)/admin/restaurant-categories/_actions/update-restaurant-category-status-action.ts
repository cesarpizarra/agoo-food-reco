"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRestaurantCategoryStatus(
  id: string,
  status: "ACTIVE" | "INACTIVE",
) {
  try {
    const category = await prisma.restaurantCategory.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/restaurant-categories");
    return { category };
  } catch (error) {
    console.error("Error updating category status:", error);
    return { error: "Failed to update category status" };
  }
}
