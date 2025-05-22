"use server";

import { RegisterWithOtpSchema, RegisterWithOtpSchemaData } from "@/schemas";
import { db } from "@/lib/db";
import { generateOtp } from "@/lib/otp";
import { isProduction } from "@/lib/utils";

export const registerWithOTP = async (values: RegisterWithOtpSchemaData) => {
  try {
    const validatedFields = RegisterWithOtpSchema.safeParse(values);

    if (!validatedFields.success) {
      return { success: false, message: "Invalid fields!" };
    }

    const { phone } = validatedFields.data;

    const { otp, otpExpires } = generateOtp();

    await db.user.upsert({
      where: {
        phone,
      },
      update: {
        phone,
        otp,
        otpExpires,
      },
      create: {
        id: crypto.randomUUID(),
        phone,
        otp,
        otpExpires,
        loginType: "PHONE",
      },
    });
    if (isProduction) {
      const response = await fetch(
        `https://www.fast2sms.com/dev/bulkV2?authorization=${process?.env.FAST2SMS_API_KEY}&route=dlt&sender_id=MRMOTP&message=179684&variables_values=${otp}%7C&flash=0&numbers=${phone}`,
      );

      if (!response.ok) {
        return { success: false, message: "Failed to send OTP" };
      }
      return {
        success: true,
        message: "OTP sent successfully",
      };
    } else {
      return {
        success: true,
        message: "OTP sent successfully" + " " + otp,
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};
