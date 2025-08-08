"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { menuItemFormSchema } from "@/schemas";
import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";

export async function createMenuItem(data: z.infer<typeof menuItemFormSchema>) {
  const imageUrl = await uploadImage(data.imageUrl as unknown as File);

  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: imageUrl?.data?.url || "",
        restaurantId: data.restaurantId,
        categoryId: data.categoryId,
      },
    });

    revalidatePath(`/admin/restaurants/${data.restaurantId}/menu`);
    return { success: true, data: menuItem };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return {
      success: false,
      error: "Failed to create menu item",
    };
  }
}
