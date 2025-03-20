import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const appointments = await db.appointment.findMany({
      include: {
        user: true,
        timeSlot: true,
        transaction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
