import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      include: {
        appointment: {
          include: {
            user: true,
            timeSlot: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
