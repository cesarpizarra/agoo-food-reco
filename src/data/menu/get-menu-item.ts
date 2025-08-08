"use server";

import { prisma } from "@/lib/prisma";

export async function getMenuItem(id: string) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      return { success: false, error: "Menu item not found" };
    }

    const [restaurant, category] = await Promise.all([
      prisma.restaurant.findUnique({
        where: { id: menuItem.restaurantId },
        select: { name: true },
      }),
      menuItem.categoryId
        ? prisma.category.findUnique({
            where: { id: menuItem.categoryId },
            select: { name: true },
          })
        : null,
    ]);

    const menuItemWithRelations = {
      ...menuItem,
      restaurant: restaurant || { name: "Unknown Restaurant" },
      category: category,
      createdAt: menuItem.createdAt.toISOString(),
      updatedAt: menuItem.updatedAt.toISOString(),
    };

    return { success: true, data: menuItemWithRelations };
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return { success: false, error: "Failed to fetch menu item" };
  }
}
