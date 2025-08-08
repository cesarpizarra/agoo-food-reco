"use server";

import { prisma } from "@/lib/prisma";
import { signUpFormSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/bcrypt";

export async function createUser(data: z.infer<typeof signUpFormSchema>) {
  try {
    const validatedData = signUpFormSchema.parse(data);

    const checkExistEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (checkExistEmail) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin/users");
    return { user };
  } catch (error) {
    console.error("Error while signing up:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to sign up" };
  }
}
