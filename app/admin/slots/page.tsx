import * as React from "react";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import NewSLot from "@/components/admin/appointment/new-slot";
import { subDays } from "date-fns";
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TimeSlotsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const sixtyDaysAgo = subDays(new Date(), 60);

  const where: Prisma.TimeSlotWhereInput = {
    date: {
      gte: sixtyDaysAgo,
      ...(search && { equals: new Date(search).toISOString() }),
    },
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
      <NewSLot
        timeSlots={timeSlots}
        search={search ?? ""}
        searchParams={searchParams}
        totalPages={totalPages}
        totalTimeSlots={totalTimeSlots}
      />
    </div>
  );
}
