import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, timeSlotId, paymentDetails } = await request.json();

    if (!userId || !timeSlotId) {
      return NextResponse.json(
        { error: "User ID and time slot ID are required" },
        { status: 400 },
      );
    }

    // Get user and time slot
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    const timeSlot = await db.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!user || !timeSlot) {
      return NextResponse.json(
        { error: "User or time slot not found" },
        { status: 404 },
      );
    }

    // Check if there are available seats
    if (timeSlot.bookedSeats >= timeSlot.totalSeats) {
      return NextResponse.json(
        { error: "No available seats for this time slot" },
        { status: 400 },
      );
    }

    // Check for canceled appointments
    const canceledAppointment = await db.canceledAppointment.findFirst({
      where: {
        phoneNumber: user.phone ?? "",
        appointmentDate: timeSlot.date,
      },
    });

    if (canceledAppointment) {
      // Delete the canceled appointment record
      await db.canceledAppointment.delete({
        where: { id: canceledAppointment.id },
      });
    }

    // Create appointment and transaction in a transaction
    const result = await db.$transaction(async (tx: any) => {
      // Update time slot to increment booked seats
      const updatedTimeSlot = await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { bookedSeats: { increment: 1 } },
      });

      // Create appointment
      const appointment = await tx.appointment.create({
        data: {
          userId,
          timeSlotId,
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          appointmentId: appointment.id,
          amount: paymentDetails?.amount || timeSlot.price,
          status: "COMPLETED",
          paymentMethod: paymentDetails?.method || "Credit Card",
          transactionId: paymentDetails?.transactionId || `mock-${Date.now()}`,
        },
      });

      // Update user progress
      await tx.userProgress.update({
        where: { userId },
        data: { lastStep: "PAYMENT" },
      });

      return { appointment, transaction };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
