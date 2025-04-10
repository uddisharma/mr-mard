"use server";

import { db } from "@/lib/db";

export const getAppointmentDetails = async (id: string) => {
  try {
    const data = await db.appointment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        timeSlot: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            totalSeats: true,
            bookedSeats: true,
            price: true,
            originalPrice: true,
          },
        },
      },
    });

    if (data) {
      return { success: true, data: data };
    } else {
      return { success: false, message: "Failed to fetch appointment details" };
    }
  } catch (error) {
    return { success: false, message: "Failed to fetch appointment details" };
  }
};
