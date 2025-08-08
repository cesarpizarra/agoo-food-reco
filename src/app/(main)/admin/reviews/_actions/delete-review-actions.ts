"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { success: false, error: "Review not found" };
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

    revalidatePath("/admin/reviews");
    revalidatePath(`/restaurants/${review.restaurantId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: "Failed to delete review",
    };
  }
}
