import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total appointments
    const totalAppointments = await db.appointment.count();

    // Get total revenue
    const transactions = await db.transaction.findMany({
      where: {
        status: "COMPLETED",
      },
    });
    const totalRevenue = transactions.reduce(
      (sum: any, transaction: any) => sum + transaction.amount,
      0,
    );

    // Get total users
    const totalUsers = await db.user.count();

    // Get canceled appointments
    const canceledAppointments = await db.canceledAppointment.count();

    return NextResponse.json({
      totalAppointments,
      totalRevenue,
      totalUsers,
      canceledAppointments,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
