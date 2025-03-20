import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const timeSlot = await db.timeSlot.findUnique({
      where: { id: params.id },
    });

    if (!timeSlot) {
      return NextResponse.json(
        { error: "Time slot not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error("Error fetching time slot:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slot" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { date, startTime, endTime, totalSeats, price, isActive } =
      await request.json();

    const timeSlot = await db.timeSlot.update({
      where: { id: params.id },
      data: {
        date: date ? new Date(date) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        totalSeats,
        price,
        isActive,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error("Error updating time slot:", error);
    return NextResponse.json(
      { error: "Failed to update time slot" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if there are any appointments for this time slot
    const appointmentsCount = await db.appointment.count({
      where: { timeSlotId: params.id },
    });

    if (appointmentsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete time slot with existing appointments" },
        { status: 400 },
      );
    }

    await db.timeSlot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return NextResponse.json(
      { error: "Failed to delete time slot" },
      { status: 500 },
    );
  }
}
