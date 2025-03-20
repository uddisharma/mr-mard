import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

// In a real app, you would use a proper OTP service
// This is a simplified mock implementation
const VALID_OTP = "123456";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber: phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 },
      );
    }

    // Validate OTP (mock implementation)
    if (otp !== VALID_OTP) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Find or create user
    const user = await db.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });

    // Create or update user progress
    await db.userProgress.upsert({
      where: { userId: user.id },
      update: { lastStep: "DATE_SELECTION" },
      create: {
        userId: user.id,
        lastStep: "DATE_SELECTION",
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
