import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await db.$transaction(async (tx) => {
      const lastProcessed = await tx.userProgress.findFirst({
        orderBy: { processedAt: "desc" },
        select: { processedAt: true },
      });

      const lastProcessedTime = lastProcessed?.processedAt || new Date(0);

      const unprocessedAppointments = await tx.userProgress.findMany({
        where: {
          updatedAt: { gt: lastProcessedTime },
          OR: [
            { processedAt: null },
            { processedAt: { lt: lastProcessedTime } },
          ],
        },
        include: {
          user: {
            select: {
              phone: true,
            },
          },
        },
      });

      if (unprocessedAppointments.length > 0) {
        await tx.userProgress.updateMany({
          where: { id: { in: unprocessedAppointments.map((app) => app.id) } },
          data: { processedAt: new Date() },
        });
      }

      return unprocessedAppointments;
    });

    return NextResponse.json(
      { message: "Processed successfully", data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
