"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reportSchema, type ReportFormData } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { Resource } from "@prisma/client";

export async function submitReport(
  reportData: ReportFormData,
  startTimeStr: string,
) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const validatedData = reportSchema.parse(reportData);
  let { questions } = validatedData;
  const startTime = startTimeStr
    ? new Date(JSON.parse(startTimeStr))
    : new Date();
  const endTime = new Date();

  try {
    await db.report.create({
      data: {
        userId: session?.id,
        startTime,
        endTime,
        sessionId: session.id,
        recommendation: {},
        questions,
        // createdAt
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/reports");
    return { success: true, message: "Report submitted successfully" };
  } catch (error) {
    console.error("Error submitting report:", error);
    return { success: false, message: "Error submitting report" };
  }
}

export async function getReports() {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.REPORTS,
    "read",
  );

  if (!hasPermission) {
    return { message: "You don't have permission to read reports" };
  }

  return db.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}
