import { db } from "@/lib/db";
import { AppointmentStatus } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, timeSlotId } = await request.json();

    if (!userId || !timeSlotId) {
      return NextResponse.json(
        { error: "User ID and time slot ID are required" },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    const timeSlot = await db.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!user || !timeSlot) {
      return NextResponse.json(
        { error: "User or time slot not found" },
        { status: 404 },
      );
    }

    if (timeSlot.bookedSeats >= timeSlot.totalSeats) {
      return NextResponse.json(
        { error: "No available seats for this time slot" },
        { status: 400 },
      );
    }

    const result = await db.$transaction(async (tx: any) => {
      await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { bookedSeats: { increment: 1 } },
      });

      const appointment = await tx.appointment.create({
        data: {
          userId,
          timeSlotId,
          status: AppointmentStatus.COMPLETED,
        },
      });

      return { appointment };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
