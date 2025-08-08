"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { menuItemFormSchema } from "@/schemas";
import { z } from "zod";

export async function updateMenuItem(
  id: string,
  data: z.infer<typeof menuItemFormSchema>,
) {
  const validatedFields = menuItemFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, imageUrl, restaurantId, categoryId } =
    validatedFields.data;

  try {
    await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imageUrl,
        restaurantId,
        categoryId,
      },
    });

    revalidatePath(`/admin/restaurants/${restaurantId}/menu`);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return {
      success: false,
      error: "Failed to update menu item",
    };
  }
}
