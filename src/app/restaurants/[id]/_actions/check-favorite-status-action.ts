"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function checkFavoriteStatus(restaurantId: string) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: true, data: { isFavorited: false } };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: true, data: { isFavorited: false } };
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId,
        },
      },
    });

    return { success: true, data: { isFavorited: !!favorite } };
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return { success: false, error: "Failed to check favorite status" };
  }
}
