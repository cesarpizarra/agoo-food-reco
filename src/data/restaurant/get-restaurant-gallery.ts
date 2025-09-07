"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurantGallery(restaurantId: string) {
  try {
    const gallery = await prisma.restaurantGallery.findMany({
      where: {
        restaurantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: gallery,
    };
  } catch (error) {
    console.error("Error fetching restaurant gallery:", error);
    return { 
      success: false, 
      error: "Failed to fetch restaurant gallery" 
    };
  }
}
