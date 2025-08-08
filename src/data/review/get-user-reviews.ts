"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserReviews() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to view your reviews",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const reviewsWithRestaurants = await Promise.all(
      reviews.map(async (review) => {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: review.restaurantId },
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        });

        return {
          ...review,
          restaurant: restaurant || {
            id: review.restaurantId,
            name: "Unknown Restaurant",
            imageUrl: "",
          },
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString(),
        };
      }),
    );

    return {
      success: true,
      data: reviewsWithRestaurants,
    };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return {
      success: false,
      error: "Failed to fetch user reviews",
    };
  }
}
