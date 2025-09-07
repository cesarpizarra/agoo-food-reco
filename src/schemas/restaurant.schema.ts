import { z } from "zod";

export const restaurantFormSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  imageUrl: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  openingHours: z.string().min(1, "Opening hours are required"),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"]).optional(),
  categoryId: z.string().optional(),
  galleryImages: z.array(z.instanceof(File)).optional(),
  galleryCaptions: z.array(z.string()).optional(),
  existingGalleryImages: z.array(z.object({
    id: z.string(),
    imageUrl: z.string(),
    caption: z.string().nullable().optional(),
  })).optional(),
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;
