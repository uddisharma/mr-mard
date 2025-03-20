import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    const date = new Date(dateParam);

    // Set time to beginning of day to match all slots on that day
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const timeSlots = await db.timeSlot.findMany({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
        isActive: true,
      },
      orderBy: {
        startTime: "asc",
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
