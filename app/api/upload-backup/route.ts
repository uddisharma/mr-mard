import { NextResponse } from "next/server";
import { data } from "@/data/backup/data";
import { db } from "@/lib/db";

type tableTypes = keyof typeof data;

export async function GET() {
  try {
    const tables = Object.keys(data);
    const uploadSummary: Record<string, number> = {};

    for (const table of tables as tableTypes[]) {
      let dataToUpload = data[table].map((item: any) => {
        return {
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        };
      });

      if (table === "user") {
        dataToUpload = data[table].map((user: any) => {
          return {
            ...user,
            email: user.email || null,
            phone: user.phone || null,
            password: user.password || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            name: user.name || "",
            otp: null,
            emails: user.emails || [],
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            otpExpires: new Date(),
            lastLogin: new Date(),
          };
        });
      }

      if (table === "timeSlot") {
        dataToUpload = data[table].map((item: any) => {
          return {
            ...item,
            date: new Date(item.date),
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });
      }

      if (table === "report") {
        dataToUpload = data[table].map((item: any) => {
          return {
            ...item,
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });
      }

      if (table === "userProgress") {
        dataToUpload = data[table].map((item: any) => {
          return {
            ...item,
            selectedDate: item.selectedDate
              ? new Date(item.selectedDate)
              : new Date(),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });
      }

      if (!dataToUpload) {
        return NextResponse.json({ error: "Table not found" }, { status: 404 });
      }

      if (!(table in db)) {
        return NextResponse.json(
          { error: "Invalid table name" },
          { status: 400 },
        );
      }

      const res = await (db[table] as any).createMany({
        data: dataToUpload,
        skipDuplicates: true,
      });

      // Add the count of uploaded records to the summary
      uploadSummary[table] = res.count;
    }

    return NextResponse.json(
      {
        message: "Backup uploaded successfully",
        data: uploadSummary,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Error in uploading backup",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
