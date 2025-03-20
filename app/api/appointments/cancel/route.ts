import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, reason } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // Get appointment with related data
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
        timeSlot: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Process cancellation in a transaction
    const result = await db.$transaction(async (tx: any) => {
      // Create canceled appointment record
      const canceledAppointment = await tx.canceledAppointment.create({
        data: {
          userId: appointment.userId,
          timeSlotId: appointment.timeSlotId,
          reason: reason || null,
          phoneNumber: appointment.user.phone,
          appointmentDate: appointment.timeSlot.date,
        },
      });

      // Update time slot to decrement booked seats
      const updatedTimeSlot = await tx.timeSlot.update({
        where: { id: appointment.timeSlotId },
        data: { bookedSeats: { decrement: 1 } },
      });

      // Delete the appointment
      await tx.appointment.delete({
        where: { id: appointmentId },
      });

      return { canceledAppointment, updatedTimeSlot };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 },
    );
  }
}
