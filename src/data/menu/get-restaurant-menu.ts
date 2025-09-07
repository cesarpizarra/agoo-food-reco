"use server";

import { prisma } from "@/lib/prisma";

export async function getMenuRestaurant(restaurantId: string) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const menuItemsWithRelations = await Promise.all(
      menuItems.map(async (item) => {
        const [restaurant, category] = await Promise.all([
          prisma.restaurant.findUnique({
            where: { id: item.restaurantId },
            select: { name: true },
          }),
          item.categoryId
            ? prisma.menuCategory.findUnique({
                where: { id: item.categoryId },
                select: { id: true, name: true },
              })
            : null,
        ]);

        return {
          ...item,
          restaurant: restaurant || { name: "Unknown Restaurant" },
          category: category,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        };
      }),
    );

    return { success: true, data: menuItemsWithRelations };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { success: false, error: "Failed to fetch menu items" };
  }
}
