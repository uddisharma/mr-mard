"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import {
  LoginWithPhoneSchema,
  LoginWithPhoneSchemaData,
  PhoneSchema,
  PhoneSchemaData,
} from "@/schemas";
import { getUserByPhone } from "@/data/user";
import { verifyOTP } from "@/data/verifyOtp";
import { db } from "@/lib/db";
import { generateOtp } from "@/lib/otp";
import { isProduction } from "@/lib/utils";

export const loginOTP = async (values: LoginWithPhoneSchemaData) => {
  const validatedFields = LoginWithPhoneSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields!" };
  }

  const { phone, otp } = validatedFields.data;

  let user = await getUserByPhone(phone);

  if (!user) {
    return { success: false, redirect: false, message: "User not found!" };
  }

  const isValid = await verifyOTP(user.id, Number(otp));

  if (!isValid) {
    return { success: false, redirect: false, message: "Invalid OTP!" };
  }

  if (!user?.signUpSuccess) {
    return { success: false, redirect: true, message: "Signup first!" };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      phone,
      otp,
      loginType: "PHONE",
    });

    await db.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    return { success: true, message: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const sendOtpRequest = async (
  values: PhoneSchemaData,
  callbackUrl?: string | null,
) => {
  const validatedFields = PhoneSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { phone } = validatedFields.data;

  const user = await getUserByPhone(phone);

  if (!user) {
    return { error: "Phone number not found!" };
  }

  const { otp, otpExpires } = generateOtp();

  if (isProduction) {
    const response = await fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${process?.env.FAST2SMS_API_KEY}&route=dlt&sender_id=MRMOTP&message=179684&variables_values=${otp}%7C&flash=0&numbers=${phone}`,
    );

    if (!response.ok) {
      return { success: false, message: "Failed to send OTP" };
    }
  }

  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpires,
      },
    });
    return {
      success: true,
      message: isProduction
        ? "OTP sent successfully"
        : `OTP sent successfully ${otp}`,
    };
  } catch (error) {
    return { error: "Failed to send OTP" };
  }
};

export const OtpVerification = async (values: LoginWithPhoneSchemaData) => {
  try {
    const validatedFields = LoginWithPhoneSchema.safeParse(values);
    if (!validatedFields.success) {
      return { success: false, message: "Invalid fields!" };
    }

    const { phone, otp } = validatedFields.data;

    let user = await getUserByPhone(phone);

    if (!user) {
      return { success: false, redirect: false, message: "User not found!" };
    }

    const isValid = await verifyOTP(user.id, Number(otp));

    if (!isValid) {
      return {
        success: false,
        redirect: false,
        message: "Invalid OTP!",
        id: user.id,
      };
    }

    await UpsertUserProgress(user?.id, String(user?.phone));

    return { success: true, message: "OTP verified!", id: user.id };
  } catch (error) {
    return { success: false, message: "Failed to verify OTP" };
  }
};

export const UpsertUserProgress = async (id: string, phone?: string) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingProgress = await db.userProgress.findFirst({
      where: {
        userId: id,
        phoneNumber: phone,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let userProgress;

    if (existingProgress) {
      userProgress = await db.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          lastStep: "DATE_SELECTION",
        },
      });
    } else {
      userProgress = await db.userProgress.create({
        data: {
          userId: id,
          phoneNumber: phone ?? "",
          lastStep: "DATE_SELECTION",
        },
      });
    }
    return { success: true, message: "User progress updated!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update user progress" };
  }
};
