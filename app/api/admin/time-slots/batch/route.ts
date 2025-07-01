import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { timeSlots } = await request.json();

    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return NextResponse.json(
        { error: "No time slots provided or invalid format" },
        { status: 400 },
      );
    }

    for (const slot of timeSlots) {
      if (
        !slot.date ||
        !slot.startTime ||
        !slot.endTime ||
        slot.totalSeats === undefined
      ) {
        return NextResponse.json(
          {
            error:
              "Each time slot must have date, startTime, endTime, and totalSeats",
          },
          { status: 400 },
        );
      }
    }

    const createdSlots = [];
    for (const slot of timeSlots) {
      try {
        // Use upsert: try to find by unique combination, else create
        // You may need a unique constraint on (date, startTime, endTime) in your schema for this to work perfectly
        const upsertedSlot = await db.timeSlot.upsert({
          where: {
            // This assumes you have a unique constraint on these three fields
            date_startTime_endTime: {
              date: new Date(slot.date),
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
            },
          },
          update: {
            totalSeats: slot.totalSeats,
            price: slot.price || 500,
            originalPrice: slot.originalPrice || 600,
            label: slot.label || "",
            isActive: slot.isActive !== undefined ? slot.isActive : true,
          },
          create: {
            date: new Date(slot.date),
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            totalSeats: slot.totalSeats,
            price: slot.price || 500,
            originalPrice: slot.originalPrice || 600,
            label: slot.label || "",
            isActive: slot.isActive !== undefined ? slot.isActive : true,
          },
        });
        createdSlots.push(upsertedSlot);
      } catch (error) {
        console.error("Error processing time slot:", error);
      }
    }

    return NextResponse.json({
      success: true,
      count: createdSlots.length,
      timeSlots: createdSlots,
    });
  } catch (error) {
    console.error("Error processing batch of time slots:", error);
    return NextResponse.json(
      { error: "Failed to process time slots batch" },
      { status: 500 },
    );
  }
}
