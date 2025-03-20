import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId, lastStep, selectedDate, selectedTimeSlotId } =
      await request.json();

    if (!userId || !lastStep) {
      return NextResponse.json(
        { error: "User ID and last step are required" },
        { status: 400 },
      );
    }

    const userProgress = await db.userProgress.update({
      where: { userId },
      data: {
        lastStep,
        selectedDate: selectedDate ? new Date(selectedDate) : undefined,
        selectedTimeSlotId,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json(
      { error: "Failed to update user progress" },
      { status: 500 },
    );
  }
}
