import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, phone, email } = body;

    if (!phone || !name) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 },
      );
    }

    let user;

    if (id) {
      // Update existing user
      user = await db.user.update({
        where: { id },
        data: {
          name,
          phone,
          email: email || undefined,
        },
      });
    } else {
      // Check if user with this phone already exists
      const existingUser = await db.user.findUnique({
        where: { phone },
      });

      if (existingUser) {
        // Update the existing user
        user = await db.user.update({
          where: { id: existingUser.id },
          data: {
            name,
            email: email || undefined,
          },
        });
      } else {
        // Create new user
        user = await db.user.create({
          data: {
            name,
            phone,
            email: email || undefined,
          },
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Failed to create/update user" },
      { status: 500 },
    );
  }
}
