"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurants(search?: string) {
  try {
    const whereClause = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { address: { contains: search } },
            {
              menuItems: {
                some: {
                  OR: [
                    { name: { contains: search } },
                    { description: { contains: search } },
                  ],
                },
              },
            },
          ],
        }
      : undefined;

    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      orderBy: [{ createdAt: "desc" }],
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
