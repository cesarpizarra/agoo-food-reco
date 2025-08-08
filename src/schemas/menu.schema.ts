import { z } from "zod";

export const menuItemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() === "") return undefined;
      return typeof val === "string" ? parseFloat(val) : val;
    },
    z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .min(0, "Price cannot be negative"),
  ),
  imageUrl: z.string().optional(),
  restaurantId: z.string().min(1, "Restaurant is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const menuItemEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() === "") return undefined;
      return typeof val === "string" ? parseFloat(val) : val;
    },
    z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .min(0, "Price cannot be negative"),
  ),
  categoryId: z.string().min(1, "Category is required"),
  restaurantId: z.string().min(1),
});

export type MenuItemEditFormData = z.infer<typeof menuItemEditSchema>;
export type MenuItemFormData = z.infer<typeof menuItemFormSchema>;
