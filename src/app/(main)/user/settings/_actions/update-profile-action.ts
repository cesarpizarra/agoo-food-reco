"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { profileFormSchema } from "@/schemas";

export type ProfileState = {
  error?: string;
  user?: {
    name: string | null;
    bio: string | null;
    id: string;
    email: string;
    role: string;
    profileImage: string | null;
  };
};

export type PasswordState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to update your profile" };
    }

    const validatedFields = profileFormSchema.safeParse({
      name: formData.get("name"),
      bio: formData.get("bio"),
    });

    if (!validatedFields.success) {
      return { error: validatedFields.error.errors[0].message };
    }

    const { name, bio } = validatedFields.data;
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, bio },
    });

    revalidatePath("/user/settings");
    return { user };
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to update profile" };
  }
}
