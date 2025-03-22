import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import Pagination from "@/components/admin/pagination";
import { Prisma } from "@prisma/client";
import { Loader2 } from "lucide-react";
import SearchInput from "@/components/others/SearchInput";
import ExportButton from "@/components/admin/export";
import Link from "next/link";
import AppointmentActions from "@/components/admin/actions/appointments";
import CleartButton from "@/components/admin/appointment/clear-button";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  // const session = await currentUser();

  // if (!session) {
  //   return redirect("/auth");
  // }

  // const hasPermission = await checkPermission(
  //   session?.role,
  //   "APPOINTMENTS",
  //   "read"
  // );

  // if (!hasPermission) {
  //   return <FormError message="You do not have permission to view this content!" />;
  // }
  const where: Prisma.AppointmentWhereInput = {
    ...(search && {
      OR: [{ timeSlot: { date: new Date(search).toISOString() } }],
    }),
  };

  const appointments = await db.appointment.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: true, timeSlot: true, transaction: true },
  });

  const totalAppointments = await db.appointment.count({ where });
  const totalPages = Math.ceil(totalAppointments / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Appointments</h2>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} type="date" />
            <CleartButton search={search} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="appointment" />
            <Link href={"/appointment-booking"}>
              <Button className="bg-btnblue hover:bg-btnblue/80 text-white">
                + New Appointment
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_1fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>ID</div>
              <div>Phone</div>
              <div>Date</div>
              <div>Time</div>
              <div>Payment</div>
              <div>Actions</div>
            </div>

            <div className="divide-y">
              {appointments.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No appointments found
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr_1fr_auto] gap-4 p-4 hover:bg-gray-50 text-left"
                  >
                    <div>{appointment.id.substring(0, 8).toUpperCase()}</div>
                    <div>{appointment.user.phone}</div>
                    <div>
                      {format(
                        new Date(appointment.timeSlot.date),
                        "dd/MM/yyyy",
                      )}
                    </div>
                    <div>
                      {format(
                        new Date(appointment.timeSlot.startTime),
                        "hh:mm a",
                      )}{" "}
                      -{" "}
                      {format(
                        new Date(appointment.timeSlot.endTime),
                        "hh:mm a",
                      )}
                    </div>
                    <div
                      className={
                        appointment.status === "CONFIRMED"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {appointment.status}
                    </div>

                    <div className="flex items-left justify-left ">
                      <AppointmentActions
                        appointment={{
                          id: appointment.id,
                          phone: appointment.user.phone ?? "",
                          status: appointment.status,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Pagination
          searchParams={searchParams}
          total={totalAppointments}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
