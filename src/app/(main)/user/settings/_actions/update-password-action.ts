"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { comparePassword, hashPassword } from "@/lib/bcrypt";
import { z } from "zod";
import { passwordFormSchema } from "@/schemas";

export type PasswordState = {
  error?: string;
  success?: boolean;
};

export async function updatePassword(
  state: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to update your password" };
    }

    const validatedFields = passwordFormSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return { error: "User not found or password not set" };
    }

    const passwordsMatch = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!passwordsMatch) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    revalidatePath("/user/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update password" };
  }
}
