import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId, lastStep, selectedDate, selectedTimeSlotId, phone } =
      await request.json();

    if (!userId || !lastStep) {
      return NextResponse.json(
        { error: "User ID and last step are required" },
        { status: 400 },
      );
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingProgress = await db.userProgress.findFirst({
      where: {
        userId,
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
          lastStep,
          selectedDate: selectedDate ? new Date(selectedDate) : undefined,
          selectedTimeSlotId,
        },
      });
    } else {
      userProgress = await db.userProgress.create({
        data: {
          userId,
          lastStep,
          phoneNumber: phone ?? "",
          selectedDate: selectedDate ? new Date(selectedDate) : undefined,
          selectedTimeSlotId,
        },
      });
    }

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("Error updating or creating user progress:", error);
    return NextResponse.json(
      { error: "Failed to update or create user progress" },
      { status: 500 },
    );
  }
}
