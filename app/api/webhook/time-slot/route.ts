import { NextRequest, NextResponse } from "next/server";
import { subDays } from "date-fns";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const cutoffDate = subDays(new Date(), 30);

    const oldTimeSlots = await db.timeSlot.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        appointments: { none: {} },
      },
      select: { id: true },
    });

    const timeSlotIdsToDelete = oldTimeSlots.map((slot) => slot.id);

    if (timeSlotIdsToDelete.length === 0) {
      return NextResponse.json({ message: "No eligible time slots to delete" });
    }

    await db.timeSlot.deleteMany({
      where: { id: { in: timeSlotIdsToDelete } },
    });

    return NextResponse.json({
      message: "Deleted old time slots with no appointments",
      count: timeSlotIdsToDelete.length,
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json(
      { error: "Failed to cleanup time slots" },
      { status: 500 },
    );
  }
}
