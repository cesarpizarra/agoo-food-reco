"use server";

import { prisma } from "@/lib/prisma";
import { userFormSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateUser(
  id: string,
  data: z.infer<typeof userFormSchema>,
) {
  try {
    const validatedData = userFormSchema.parse(data);
    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/admin/users");
    return { user };
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update user" };
  }
}
