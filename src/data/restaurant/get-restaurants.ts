"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: restaurants,
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return {
      success: false,
      error: "Failed to fetch restaurants",
    };
  }
}
