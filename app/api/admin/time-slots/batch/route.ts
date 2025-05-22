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

    const result = await db.$transaction(async (tx: any) => {
      const createdSlots = [];

      for (const slot of timeSlots) {
        try {
          const existingSlot = await tx.timeSlot.findFirst({
            where: {
              date: new Date(slot.date),
              startTime: new Date(slot.startTime),
              endTime: new Date(slot.endTime),
            },
          });

          if (existingSlot) {
            const updatedSlot = await tx.timeSlot.update({
              where: { id: existingSlot.id },
              data: {
                totalSeats: slot.totalSeats,
                price: slot.price || 500,
                originalPrice: slot.originalPrice || 600,
                label: slot.label || "",
                isActive: slot.isActive !== undefined ? slot.isActive : true,
              },
            });
            createdSlots.push(updatedSlot);
          } else {
            const newSlot = await tx.timeSlot.create({
              data: {
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
            createdSlots.push(newSlot);
          }
        } catch (error) {
          console.error("Error processing time slot:", error);
        }
      }

      return createdSlots;
    });

    return NextResponse.json({
      success: true,
      count: result.length,
      timeSlots: result,
    });
  } catch (error) {
    console.error("Error processing batch of time slots:", error);
    return NextResponse.json(
      { error: "Failed to process time slots batch" },
      { status: 500 },
    );
  }
}
