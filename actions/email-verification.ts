"use server";
import { verifyOTP } from "@/data/verifyOtp";
import { db } from "@/lib/db";
import { sendVerificationOTP } from "@/lib/mail";
import { generateOtp } from "@/lib/otp";
import { isProduction } from "@/lib/utils";
import { z } from "zod";

export async function EmailVerification(
  phone: string,
  email: string,
  isResend = false,
) {
  try {
    const existingUserwithEmail = await db.user.findUnique({
      where: { email },
    });

    if (!isResend && existingUserwithEmail) {
      return { success: false, message: "Email already exists" };
    }

    const existingUser = await db.user.findUnique({
      where: { phone },
    });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    const { otp, otpExpires } = await generateOtp();

    if (isProduction) {
      const response = await sendVerificationOTP(email, otp);
      if (!response?.success)
        return { success: false, message: "Failed to send OTP" };
      await db.user.update({
        where: { phone },
        data: {
          email,
          otp,
          otpExpires,
        },
      });
      return { success: true, message: "OTP sent successfully" };
    } else {
      return { success: true, message: "OTP sent successfully" + " " + otp };
    }
  } catch (error) {
    // @ts-ignore
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: "An error occurred. Please try again." };
  }
}

export async function VerifyEmail(email: string, otp: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isValid = await verifyOTP(user.id, Number(otp));

    if (!isValid) {
      return { success: false, message: "Invalid OTP" };
    }

    return { success: true, message: "Email verified successfully" };
  } catch (error) {
    return { success: false, message: "An error occurred. Please try again." };
  }
}
