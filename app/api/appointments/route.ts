import { db } from "@/lib/db";
import { AppointmentStatus } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      timeSlotId,
      paymentDetails,
      id = null,
    } = await request.json();

    if (!userId || !timeSlotId) {
      return NextResponse.json(
        { error: "User ID and time slot ID are required" },
        { status: 400 },
      );
    }

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

    if (timeSlot.bookedSeats >= timeSlot.totalSeats) {
      return NextResponse.json(
        { error: "No available seats for this time slot" },
        { status: 400 },
      );
    }

    // const canceledAppointment = await db.canceledAppointment.findFirst({
    //   where: {
    //     phoneNumber: user.phone ?? "",
    //     appointmentDate: timeSlot.date,
    //   },
    // });

    // if (canceledAppointment) {
    //   await db.canceledAppointment.delete({
    //     where: { id: canceledAppointment.id },
    //   });
    // }

    if (id) {
      const result = await db.$transaction(async (tx: any) => {
        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: { bookedSeats: { increment: 1 } },
        });

        await tx.appointment.update({
          where: { id },
          data: {
            status: AppointmentStatus.COMPLETED,
          },
        });

        await tx.transaction.create({
          data: {
            appointmentId: id,
            amount: Float(paymentDetails?.amount || timeSlot.price),
            status: "COMPLETED",
            paymentMethod: paymentDetails?.method || "Credit Card",
            transactionId:
              paymentDetails?.transactionId || `mock-${Date.now()}`,
          },
        });
      });
      return NextResponse.json(result);
    } else {
      const result = await db.$transaction(async (tx: any) => {
        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: { bookedSeats: { increment: 1 } },
        });

        const appointment = await tx.appointment.create({
          data: {
            userId,
            timeSlotId,
          },
        });

        const transaction = await tx.transaction.create({
          data: {
            appointmentId: appointment.id,
            amount: paymentDetails?.amount || timeSlot.price,
            status: "COMPLETED",
            paymentMethod: paymentDetails?.method || "Credit Card",
            transactionId:
              paymentDetails?.transactionId || `mock-${Date.now()}`,
          },
        });

        await tx.userProgress.delete({
          where: { userId },
        });

        return { appointment, transaction };
      });
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
function Float(amount: any): number {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) {
    throw new Error("Invalid amount provided");
  }
  return parsed;
}
