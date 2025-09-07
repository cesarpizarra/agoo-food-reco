"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categoryFormSchema } from "@/schemas";
import { z } from "zod";

export async function updateRestaurantCategory(
  id: string,
  data: z.infer<typeof categoryFormSchema>,
) {
  try {
    const validatedData = categoryFormSchema.parse(data);
    const category = await prisma.restaurantCategory.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/admin/restaurant-categories");
    return { category };
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update category" };
  }
}
