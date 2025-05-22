import { db } from "@/lib/db";
import { timeZone } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";
import { type NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
    const body = await request.json();
    const {
      date,
      startTime,
      endTime,
      totalSeats,
      originalPrice,
      price,
      label,
      isActive,
    } = body;

    // Get the current values from DB
    const existingSlot = await db.timeSlot.findUnique({
      where: { id: params.id },
    });

    if (!existingSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Only update if values are different
    if (
      date &&
      new Date(date).toISOString().slice(0, 10) !==
        existingSlot.date.toISOString().slice(0, 10)
    ) {
      updateData.date = toZonedTime(new Date(date), timeZone);
    }

    if (
      startTime &&
      new Date(startTime).getTime() !==
        new Date(existingSlot.startTime).getTime()
    ) {
      updateData.startTime = new Date(startTime);
    }

    if (
      endTime &&
      new Date(endTime).getTime() !== new Date(existingSlot.endTime).getTime()
    ) {
      updateData.endTime = new Date(endTime);
    }

    if (totalSeats !== undefined) updateData.totalSeats = totalSeats;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (price !== undefined) updateData.price = price;
    if (label !== undefined) updateData.label = label;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    const timeSlot = await db.timeSlot.update({
      where: { id: params.id },
      data: updateData,
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
