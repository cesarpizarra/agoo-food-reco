"use server";

import { prisma } from "@/lib/prisma";

export async function getRestaurantReviews(restaurantId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        restaurantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await prisma.user.findUnique({
          where: { id: review.userId },
          select: {
            name: true,
            email: true,
          },
        });

        return {
          ...review,
          user: user || { name: null, email: "Unknown User" },
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString(),
        };
      }),
    );

    return {
      success: true,
      data: reviewsWithUsers,
    };
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    return {
      success: false,
      error: "Failed to fetch restaurant reviews",
    };
  }
}
