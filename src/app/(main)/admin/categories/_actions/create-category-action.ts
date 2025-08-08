"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categoryFormSchema } from "@/schemas";
import { z } from "zod";

export async function createCategory(data: z.infer<typeof categoryFormSchema>) {
  try {
    const validatedData = categoryFormSchema.parse(data);

    const checkExistName = await prisma.category.findUnique({
      where: { name: validatedData.name },
    });
    if (checkExistName) {
      return { error: "Category name already exists" };
    }

    const category = await prisma.category.create({
      data: validatedData,
    });
    revalidatePath("/admin/categories");
    return { category };
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to create category" };
  }
}
