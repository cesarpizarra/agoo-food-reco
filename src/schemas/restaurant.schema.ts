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
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;
