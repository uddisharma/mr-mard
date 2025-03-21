"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import Pagination from "@/components/admin/pagination";
import { Prisma } from "@prisma/client";
import { Loader2, FileSpreadsheet, Plus } from "lucide-react";
import SearchInput from "@/components/others/SearchInput";
import ExportButton from "@/components/admin/export";
import Link from "next/link";
// import TimeSlotForm from "./time-slot-form";
// import ExcelImportExport from "./excel-import-export";
import { toast } from "sonner";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TimeSlotsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  //   const session = await currentUser();

  //   if (!session) {
  //     return redirect("/auth");
  //   }

  //   const hasPermission = await checkPermission(session?.role, "TIME_SLOTS", "read");

  //   if (!hasPermission) {
  //     return <FormError message="You do not have permission to view this content!" />;
  //   }

  const where: Prisma.TimeSlotWhereInput = {
    ...(search && {
      OR: [{ date: { equals: search } }],
    }),
  };

  const timeSlots = await db.timeSlot.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { date: "desc" },
  });

  const totalTimeSlots = await db.timeSlot.count({ where });
  const totalPages = Math.ceil(totalTimeSlots / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Time Slots</h2>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="blog" />
            <Link href="/admin/slots/new">
              <Button className="bg-btnblue hover:bg-btnblue/80 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Time Slot
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[0.8fr_1.5fr_0.5fr_0.5fr_0.5fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>Date</div>
              <div>Time</div>
              <div>Seats</div>
              <div>Price</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            <div className="divide-y">
              {timeSlots.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No time slots found
                </div>
              ) : (
                timeSlots.map((timeSlot) => (
                  <div
                    key={timeSlot.id}
                    className="grid grid-cols-[0.8fr_1.5fr_0.5fr_0.5fr_0.5fr_auto] gap-4 p-4 hover:bg-gray-50 text-left"
                  >
                    <div>{format(new Date(timeSlot.date), "dd/MM/yyyy")}</div>
                    <div>
                      {format(new Date(timeSlot.startTime), "hh:mm a")} -{" "}
                      {format(new Date(timeSlot.endTime), "hh:mm a")}
                    </div>
                    <div>
                      {timeSlot.bookedSeats} / {timeSlot.totalSeats}
                    </div>
                    <div>{timeSlot.price}</div>
                    <div
                      className={
                        timeSlot.isActive ? "text-green-500" : "text-red-500"
                      }
                    >
                      {timeSlot.isActive ? "Active" : "Inactive"}
                    </div>
                    <div>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Pagination
          searchParams={searchParams}
          totalBlogs={totalTimeSlots}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
