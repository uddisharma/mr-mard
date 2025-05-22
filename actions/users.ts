"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { userSchema, type UserFormData } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { Resource } from "@prisma/client";
import { checkPermission } from "@/lib/checkPermission";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function addUser(userData: UserFormData) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.USERS,
    "create",
  );

  if (!hasPermission) {
    return { message: "You don't have permission to add a user" };
  }

  try {
    const validatedData = userSchema.parse(userData);

    if (validatedData?.password !== undefined) {
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await db.user.create({
        data: {
          ...validatedData,
          id: crypto.randomUUID(),
          name: validatedData.firstName + " " + validatedData.lastName,
          password: hashedPassword,
        },
      });
      revalidatePath("/admin/users");
      return user;
    } else {
      const user = await db.user.create({
        data: {
          ...validatedData,
          id: crypto.randomUUID(),
          name: validatedData.firstName + " " + validatedData.lastName,
        },
      });

      revalidatePath("/admin/users");
      return user;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(userId: string, userData: UserFormData) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.USERS,
    "update",
  );

  if (!hasPermission) {
    return { message: "You don't have permission to update a user" };
  }

  const validatedData = userSchema.parse(userData);

  const user = await db.user.update({
    where: { id: userId },
    data: validatedData,
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  return user;
}

export const getUsers = unstable_cache(
  async () => {
    const session = await currentUser();

    if (!session) {
      return redirect("/auth");
    }

    const hasPermission = await checkPermission(
      session?.role,
      Resource.USERS,
      "read",
    );

    if (!hasPermission) {
      return { message: "You don't have permission to read users" };
    }

    return db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
  ["users"],
  { revalidate: 60 }, // Revalidate every 60 seconds
);
