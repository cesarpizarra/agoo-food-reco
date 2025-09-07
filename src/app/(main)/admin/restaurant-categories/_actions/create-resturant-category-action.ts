"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categoryFormSchema } from "@/schemas";
import { z } from "zod";

export async function createRestaurantCategory(data: z.infer<typeof categoryFormSchema>) {
  try {
    const validatedData = categoryFormSchema.parse(data);

    const checkExistName = await prisma.restaurantCategory.findUnique({
      where: { name: validatedData.name },
    });
    if (checkExistName) {
      return { error: "Restaurant category name already exists" };
    }

    const category = await prisma.restaurantCategory.create({
      data: validatedData,
    });
    revalidatePath("/admin/restaurant-categories");
    return { category };
  } catch (error) {
    console.error("Error creating restaurant category:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to create restaurant category" };
  }
}
