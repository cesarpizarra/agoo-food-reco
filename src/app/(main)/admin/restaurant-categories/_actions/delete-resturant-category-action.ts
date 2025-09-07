"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteRestaurantCategory(id: string) {
  try {
    await prisma.restaurantCategory.delete({
      where: { id },
    });
    revalidatePath("/admin/restaurant-categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting restaurant category:", error);
    return { error: "Failed to delete restaurant category" };
  }
}
