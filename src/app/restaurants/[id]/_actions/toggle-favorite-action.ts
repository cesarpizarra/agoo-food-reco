"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(restaurantId: string) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to add favorites",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_restaurantId: {
            userId: user.id,
            restaurantId,
          },
        },
      });

      revalidatePath(`/restaurants/${restaurantId}`);
      return { success: true, data: { isFavorited: false } };
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          restaurantId,
        },
      });

      revalidatePath(`/restaurants/${restaurantId}`);
      return { success: true, data: { isFavorited: true } };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to toggle favorite" };
  }
}
