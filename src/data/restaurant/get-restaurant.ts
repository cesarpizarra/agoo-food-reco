"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurant(id: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return {
        success: false,
        error: "Restaurant not found",
      };
    }

    return {
      success: true,
      data: restaurant,
    };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return {
      success: false,
      error: "Failed to fetch restaurant",
    };
  }
}
