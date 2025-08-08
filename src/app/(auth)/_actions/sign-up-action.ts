"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { signUpFormSchema, SignUpFormData } from "@/schemas";
import { hashPassword } from "@/lib/bcrypt";
import { sendMail } from "@/utils/mail.util";
import { generateUUID } from "@/utils/uuid";

export async function signUp(data: SignUpFormData) {
  try {
    const validatedData = signUpFormSchema.parse(data);

    const checkExistEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (checkExistEmail) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const verificationToken = generateUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #fff8f0; border: 1px solid #f1e0c6; padding: 30px; border-radius: 12px;">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #d35400; margin: 0;">🍽 Welcome to Agoo La Union Foods!</h1>
          <p style="color: #7f5539; font-size: 14px; margin-top: 5px;">Serving you fresh flavors and warm smiles</p>
        </div>
        
        <p style="color: #333;">Hi <strong>${validatedData.name}</strong>,</p>
        <p>Thank you for joining <strong>Agoo La Union Foods</strong>! To start enjoying our services, please confirm your email by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #e67e22; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
             Verify My Email
          </a>
        </div>
        
        <p style="color: #444;">This link is valid for the next <strong>24 hours</strong>.</p>
        <p>If you didn’t register with Agoo La Union Foods, you can safely ignore this message.</p>
    
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0d4c0;" />
    
        <p style="font-size: 12px; color: #777;">
          If the button above doesn't work, please copy and paste this link into your browser:<br />
          <a href="${verificationUrl}" style="color: #d35400;">${verificationUrl}</a>
        </p>
    
        <p style="font-size: 11px; color: #aaa; text-align: center; margin-top: 40px;">
          © ${new Date().getFullYear()} Agoo La Union Foods. All rights reserved.
        </p>
      </div>
    `;

    await sendMail({
      to: validatedData.email,
      subject: "Verify Your Email Address",
      html: emailHtml,
    });

    return { user };
  } catch (error) {
    console.error("Error while signing up:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to sign up" };
  }
}
