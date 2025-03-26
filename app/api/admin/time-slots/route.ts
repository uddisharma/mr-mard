import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import { toZonedTime } from "date-fns-tz";
import { timeZone } from "@/lib/utils";

export async function GET() {
  try {
    const timeSlots = await db.timeSlot.findMany({
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch time slots" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      date,
      startTime,
      endTime,
      totalSeats,
      originalPrice,
      price,
      label,
      isActive,
    } = await request.json();

    if (!date || !startTime || !endTime || totalSeats === undefined) {
      return NextResponse.json(
        { error: "Date, start time, end time, and total seats are required" },
        { status: 400 },
      );
    }

    const timeSlot = await db.timeSlot.create({
      data: {
        date: toZonedTime(new Date(date), timeZone),
        startTime: toZonedTime(new Date(startTime), timeZone),
        endTime: toZonedTime(new Date(endTime), timeZone),
        totalSeats,
        originalPrice: originalPrice || 600,
        price: price || 500,
        label: label || "",
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error("Error creating time slot:", error);
    return NextResponse.json(
      { error: "Failed to create time slot" },
      { status: 500 },
    );
  }
}
