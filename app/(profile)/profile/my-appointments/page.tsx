import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/others/ProfileHeader";
import AppointmentsList from "@/components/others/AppointmentList";

export default async function MyAppointmentsPage() {
  const sessions = await currentUser();
  if (!sessions) {
    return redirect("/auth");
  }

  const appointments = await db.appointment.findMany({
    where: { userId: sessions.id },
    select: {
      id: true,
      userId: true,
      timeSlotId: true,
      status: true,
      transaction: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { name: true, email: true },
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
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen px-5 md:px-16 pt-5">
      <ProfileHeader user={sessions} />
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
