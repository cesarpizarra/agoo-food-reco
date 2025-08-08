"use server";

import { prisma } from "@/lib/prisma";

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const reviewsWithRelations = await Promise.all(
      reviews.map(async (review) => {
        const [user, restaurant] = await Promise.all([
          prisma.user.findUnique({
            where: { id: review.userId },
            select: {
              name: true,
              email: true,
              profileImage: true,
            },
          }),
          prisma.restaurant.findUnique({
            where: { id: review.restaurantId },
            select: {
              name: true,
            },
          }),
        ]);

        return {
          ...review,
          user: user || {
            name: null,
            email: "Unknown User",
            profileImage: null,
          },
          restaurant: restaurant || { name: "Unknown Restaurant" },
          createdAt: review.createdAt.toISOString(),
          updatedAt: review.updatedAt.toISOString(),
        };
      }),
    );

    return {
      success: true,
      data: reviewsWithRelations,
    };
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return {
      success: false,
      error: "Failed to fetch reviews",
    };
  }
}
