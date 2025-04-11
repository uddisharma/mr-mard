import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ExportType } from "@/schemas/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: ExportType } },
) {
  const session = await currentUser();
  const type = params.type;
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }
  if (!from || !to) {
    return NextResponse.json(
      { error: "From and To dates are required" },
      { status: 400 },
    );
  }
  if (new Date(from) > new Date(to)) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = {
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  };

  try {
    switch (type) {
      case "blog":
        const blogs = await db.blog.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(blogs, { status: 200 });
      case "question":
        const questions = await db.question.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(questions, { status: 200 });
      case "contact":
        const contactSubmissions = await db.contactSubmission.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(contactSubmissions, { status: 200 });
      case "report":
        const reports = await db.report.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(reports, { status: 200 });
      case "user":
        const users = await db.user.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(users, { status: 200 });
      case "leads":
        const leads = await db.leads.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(leads, { status: 200 });
      case "newsletter":
        const newsletters = await db.newsLetter.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(newsletters, { status: 200 });
      case "appointment":
        const appointments = await db.appointment.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(appointments, { status: 200 });
      case "cancelled":
        const cancelledAppointments = await db.userProgress.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(cancelledAppointments, { status: 200 });
      case "transaction":
        const transactions = await db.transaction.findMany({
          ...query,
          orderBy: { createdAt: "desc" as const },
        });
        return NextResponse.json(transactions, { status: 200 });
      default:
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 },
    );
  }
}
