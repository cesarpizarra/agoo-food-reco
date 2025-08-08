"use server";

import { hashPassword } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/utils/mail.util";

export async function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}): Promise<{ success?: string; error?: string }> {
  try {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord) {
      return { error: "Invalid or expired reset token." };
    }

    if (resetRecord.expiresAt < new Date()) {
      return { error: "Reset token has expired." };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    await sendMail({
      to: resetRecord.user.email,
      subject: "Password Reset Successfully",
      html: `<p>Your password has been reset successfully.</p>`,
    });

    return { success: "Password has been reset successfully." };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Failed to reset password." };
  }
}
