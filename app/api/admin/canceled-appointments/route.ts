import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const canceledAppointments = await db.canceledAppointment.findMany({
      orderBy: {
        canceledAt: "desc",
      },
    });

    return NextResponse.json(canceledAppointments);
  } catch (error) {
    console.error("Error fetching canceled appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch canceled appointments" },
      { status: 500 },
    );
  }
}
