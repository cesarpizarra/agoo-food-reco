"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RestaurantFormData } from "@/schemas";
import { uploadImage } from "@/lib/cloudinary";

export async function createRestaurant(data: RestaurantFormData) {
  try {
    const imageUrl = await uploadImage(data.imageUrl as unknown as File);
    const restaurant = await prisma.restaurant.create({
      data: {
        ownerName: data.ownerName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        imageUrl: imageUrl?.data?.url || "",
        description: data.description,
        openingHours: data.openingHours,
        categoryId: data.categoryId,
      },
    });

    if (data.galleryImages && data.galleryImages.length > 0) {
      const galleryPromises = data.galleryImages.map(async (file, index) => {
        const uploadedImage = await uploadImage(file);
        return prisma.restaurantGallery.create({
          data: {
            imageUrl: uploadedImage?.data?.url || "",
            caption: data.galleryCaptions?.[index] || null,
            restaurantId: restaurant.id,
          },
        });
      });

      await Promise.all(galleryPromises);
    }

    revalidatePath("/admin/restaurants");
    return { success: true, data: restaurant };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create restaurant" };
  }
}
