"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurantCategories() {
  try {
    const categories = await prisma.restaurantCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching restaurant categories:", error);
    return { error: "Failed to fetch restaurant categories" };
  }
}
