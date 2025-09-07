"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RestaurantFormData } from "@/schemas";
import { uploadImage } from "@/lib/cloudinary";

export async function updateRestaurant(id: string, data: RestaurantFormData) {
  try {
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id },
    });
    if (!existingRestaurant) {
      return { success: false, error: "Restaurant not found" };
    }

    let imageUrl = existingRestaurant.imageUrl;

    if (typeof data.imageUrl !== "string") {
      const uploadResult = await uploadImage(
        data.imageUrl as unknown as File,
        "restaurants",
      );

      if (!uploadResult.success || !uploadResult.data?.url) {
        return {
          success: false,
          error: uploadResult.error || "Image upload failed",
        };
      }

      imageUrl = uploadResult.data.url;
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ownerName: data.ownerName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        imageUrl,
        description: data.description,
        openingHours: data.openingHours,
        status: data.status,
        categoryId: data.categoryId,
      },
    });

    if (data.existingGalleryImages || (data.galleryImages && data.galleryImages.length > 0)) {
      await prisma.restaurantGallery.deleteMany({
        where: { restaurantId: id },
      });

      const galleryPromises = [];

      if (data.existingGalleryImages) {
        for (const existingImage of data.existingGalleryImages) {
          galleryPromises.push(
            prisma.restaurantGallery.create({
              data: {
                imageUrl: existingImage.imageUrl,
                caption: existingImage.caption,
                restaurantId: id,
              },
            })
          );
        }
      }

      if (data.galleryImages && data.galleryImages.length > 0) {
        for (let i = 0; i < data.galleryImages.length; i++) {
          const file = data.galleryImages[i];
          const uploadedImage = await uploadImage(file);
          galleryPromises.push(
            prisma.restaurantGallery.create({
              data: {
                imageUrl: uploadedImage?.data?.url || "",
                caption: data.galleryCaptions?.[i] || null,
                restaurantId: id,
              },
            })
          );
        }
      }

      await Promise.all(galleryPromises);
    }

    revalidatePath("/admin/restaurants");

    return { success: true, data: restaurant };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update restaurant",
    };
  }
}
