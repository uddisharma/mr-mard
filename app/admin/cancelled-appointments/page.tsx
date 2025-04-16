import * as React from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";
import Pagination from "@/components/admin/pagination";
import { Prisma } from "@prisma/client";
import SearchInput from "@/components/others/SearchInput";
import ExportButton from "@/components/admin/export";
import CleartButton from "@/components/admin/appointment/clear-button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CancelledAppointmentsPage({
  searchParams,
}: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const where: Prisma.UserProgressWhereInput = {
    ...(search && {
      OR: [
        {
          updatedAt: {
            gte: new Date(new Date(search).setHours(0, 0, 0, 0)),
            lt: new Date(new Date(search).setHours(23, 59, 59, 999)),
          },
        },
      ],
    }),
  };

  const cancelledAppointments = await db.userProgress.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { updatedAt: "desc" },
    include: { user: true },
  });

  const totalCancelled = await db.userProgress.count({ where });
  const totalPages = Math.ceil(totalCancelled / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Cancelled Appointments</h2>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} type="date" />
            <CleartButton search={search} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="cancelled" />
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div className="font-semibold">Started Date</div>
              <div className="font-semibold">ID</div>
              <div className="font-semibold">Phone</div>
              <div className="font-semibold">Last Step</div>
              <div className="font-semibold">Updated At</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {cancelledAppointments.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No cancelled appointments found
                </div>
              ) : (
                cancelledAppointments.map((progress) => (
                  <div
                    key={progress.id}
                    className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 text-left"
                  >
                    <div>
                      {format(new Date(progress.createdAt), "dd/MM/yyyy")}
                    </div>
                    <div>{progress.id.substring(0, 8).toUpperCase()}</div>
                    <div>{progress.user.phone}</div>
                    <div>{progress.lastStep}</div>
                    <div>
                      {/* {format(
                        new Date(progress.updatedAt),
                        "dd/MM/yyyy hh:mm a",
                      )} */}
                      {format(new Date(progress.updatedAt), "dd/MM/yyyy")}{" "}
                      {dayjs(progress.updatedAt).format("hh:mm A")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <Pagination
          searchParams={searchParams}
          total={totalCancelled}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
