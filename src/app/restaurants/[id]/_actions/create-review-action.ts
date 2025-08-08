"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(500),
  restaurantId: z.string(),
});

export async function createReview(data: z.infer<typeof reviewSchema>) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "You must be logged in to add a review" };
    }

    const validatedFields = reviewSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, error: "Invalid review data" };
    }

    const { rating, comment, restaurantId } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId,
        },
      },
    });

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this restaurant",
      };
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        restaurantId,
        updatedAt: new Date(),
      },
    });

    const allReviews = await prisma.review.findMany({
      where: { restaurantId },
      select: { rating: true },
    });

    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating = totalRating / allReviews.length;

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        averageRating,
        totalReviews: allReviews.length,
      },
    });

    revalidatePath(`/restaurants/${restaurantId}`);

    return { success: true, data: review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
}
