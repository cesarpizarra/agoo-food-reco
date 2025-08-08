"use server";

import { prisma } from "@/lib/prisma";

export async function getPopularRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: [
        {
          averageRating: "desc",
        },
        {
          totalReviews: "desc",
        },
      ],
      take: 5,
    });

    return {
      success: true,
      data: restaurants,
    };
  } catch (error) {
    console.error("Error fetching popular restaurants:", error);
    return {
      success: false,
      error: "Failed to fetch popular restaurants",
    };
  }
}
