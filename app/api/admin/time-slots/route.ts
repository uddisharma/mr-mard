import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  try {
    const timeSlots = await db.timeSlot.findMany({
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      where: {
        createdAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
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
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
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

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  try {
    await db.timeSlot.deleteMany({
      where: {
        createdAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
        appointments: {
          none: {},
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error delete time slots:", error);
    return NextResponse.json(
      { error: "Failed to delete time slots" },
      { status: 500 },
    );
  }
}
