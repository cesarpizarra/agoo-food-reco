"use server";

import { prisma } from "@/lib/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch categories" };
  }
}
