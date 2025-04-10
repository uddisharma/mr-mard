import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        phone: phone,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error searching for user:", error);
    return NextResponse.json(
      { error: "Failed to search for user" },
      { status: 500 },
    );
  }
}
