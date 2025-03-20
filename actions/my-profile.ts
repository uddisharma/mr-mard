"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
//@ts-ignore
import { Resource } from "@prisma/client";
import { ProfileFormData, ProfileSchema } from "@/schemas";

export async function updateProfile(userData: any) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  try {
    await db.user.update({
      where: { id: session.id },
      data: {
        ...userData,
        name: userData?.firstName + " " + userData?.lastName,
      },
    });
    revalidatePath("/profile1");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, message: "Failed to update user" };
  }
}

export async function deleteProfile() {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.USERS,
    "delete",
  );

  if (!hasPermission) {
    return { message: "You don't have permission to delete this profile" };
  }

  await db.user.delete({
    where: { id: session.id },
  });

  revalidatePath("/profile");
}

export async function updateAdminProfile(data: ProfileFormData) {
  const validatedData = ProfileSchema.parse(data);

  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  try {
    await db.user.update({
      where: { id: session.id },
      data: validatedData,
    });

    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function updateProfilePhoto(
  photoUrl: string,
): Promise<{ success: boolean; error?: string } | undefined> {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  try {
    await db.user.update({
      where: {
        id: session.id,
      },
      data: {
        image: photoUrl,
      },
    });

    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function updateProfileEmail(
  emails: { emails: string; createdAt: string }[],
  type: string,
) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  try {
    if (type == "add") {
      const user = await db.user.findUnique({
        where: { id: session.id },
        select: { emails: true },
      });
      //@ts-ignore
      const lastEmail = emails[emails.length - 1].email;
      //@ts-ignore
      if (user?.emails.some((email) => email.email === lastEmail)) {
        return { success: false, message: "Email already exists" };
      }
    }

    await db.user.update({
      where: { id: session.id },
      data: {
        emails,
      },
    });

    revalidatePath("/profile1");
    return {
      success: true,
      message: `Email ${type == "add" ? "added" : "deleted"} successfully`,
    };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, message: "Failed to update user" };
  }
}
