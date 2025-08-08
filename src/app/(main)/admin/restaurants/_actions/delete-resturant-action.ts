"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteRestaurant(id: string) {
  try {
    await prisma.restaurant.delete({
      where: { id },
    });

    revalidatePath("/admin/restaurants");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return {
      success: false,
      error: "Failed to delete restaurant",
    };
  }
}
