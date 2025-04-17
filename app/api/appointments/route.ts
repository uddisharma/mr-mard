import { db } from "@/lib/db";
import { sendAppointmentBookings } from "@/lib/mail";
import { isProduction } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(request: NextRequest) {
  try {
    const { userId, timeSlotId, paymentDetails } = await request.json();

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

    const canceledAppointment = await db.canceledAppointment.findFirst({
      where: {
        phoneNumber: user.phone ?? "",
        appointmentDate: timeSlot.date,
      },
    });

    if (canceledAppointment) {
      await db.canceledAppointment.delete({
        where: { id: canceledAppointment.id },
      });
    }

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
          transactionId: paymentDetails?.transactionId || `mock-${Date.now()}`,
        },
      });

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      await tx.userProgress.deleteMany({
        where: {
          userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return { appointment, transaction };
    });

    if (isProduction) {
      await sendAppointmentBookings(
        "naveen@mrmard.com",
        user.name ?? "",
        user.phone ?? "",
        dayjs(timeSlot.date).tz("Asia/Kolkata").format("DD/MM/YYYY"),
        `${dayjs.utc(timeSlot.startTime).format("h:mm A")} - ${dayjs
          .utc(timeSlot.endTime)
          .format("h:mm A")}`,
      );

      await sendAppointmentBookings(
        "santhosh.k@mrmard.com",
        user.name ?? "",
        user.phone ?? "",
        dayjs(timeSlot.date).tz("Asia/Kolkata").format("DD/MM/YYYY"),
        `${dayjs.utc(timeSlot.startTime).format("h:mm A")} - ${dayjs
          .utc(timeSlot.endTime)
          .format("h:mm A")}`,
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
