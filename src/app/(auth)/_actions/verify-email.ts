"use server";

import { prisma } from "@/lib/prisma";

export async function verifyEmail(token: string) {
  try {
    if (!token) {
      return { error: "Verification token is required" };
    }

    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return { error: "Invalid verification token" };
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      return { error: "Verification token has expired" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { success: "Email verified successfully" };
  } catch (error) {
    console.error("Email verification error:", error);
    return { error: "Failed to verify email" };
  }
}
