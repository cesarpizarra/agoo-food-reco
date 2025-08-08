"use server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/utils/mail.util";
import { generateUUID } from "@/utils/uuid";

export async function sendResetPasswordEmail(
  email: string,
): Promise<{ success?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: "No account found with that email address." };
    }

    const resetToken = generateUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token: resetToken, expiresAt },
      create: { userId: user.id, token: resetToken, expiresAt },
    });

    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const subject = "Reset your password";
    const html = `<p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p><strong>This link is valid for 5 minutes only.</strong></p>
      <p>If you did not request this, you can ignore this email.</p>`;

    return await sendMail({
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { error: "Failed to send reset password email." };
  }
}
