import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Resource } from "@prisma/client";
import { checkPermission } from "@/lib/checkPermission";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await currentUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.REPORTS,
    "delete",
  );

  if (!hasPermission) {
    return NextResponse.json(
      { error: "You don't have permission to delete a report" },
      { status: 403 },
    );
  }

  const id = params.id;

  try {
    await db.analysis.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete analysis" },
      { status: 500 },
    );
  }
}
