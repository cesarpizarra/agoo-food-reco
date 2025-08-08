"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteUserReview(reviewId: string) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to delete reviews",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        userId: user.id,
      },
    });

    if (!review) {
      return {
        success: false,
        error: "Review not found or you don't have permission to delete it",
      };
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    const allReviews = await prisma.review.findMany({
      where: { restaurantId: review.restaurantId },
      select: { rating: true },
    });

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const averageRating = totalRating / allReviews.length;

      await prisma.restaurant.update({
        where: { id: review.restaurantId },
        data: {
          averageRating,
          totalReviews: allReviews.length,
        },
      });
    } else {
      await prisma.restaurant.update({
        where: { id: review.restaurantId },
        data: {
          averageRating: 0,
          totalReviews: 0,
        },
      });
    }

    revalidatePath("/user/reviews");
    revalidatePath(`/restaurants/${review.restaurantId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting user review:", error);
    return {
      success: false,
      error: "Failed to delete review",
    };
  }
}
