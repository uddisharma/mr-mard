import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { checkPermission } from "@/lib/checkPermission";
import { Resource } from "@prisma/client";
import { FormError } from "@/components/others/form-error";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: { id: string };
}

export default async function ViewReportPage({ params }: PageProps) {
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
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  const report = await db.report.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      user: true,
    },
  });

  if (!report) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">View Report</h2>
        <Link href="/admin/reports" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Report Details</CardTitle>
          <CardDescription>
            Information about the report and its creator
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-semibold mr-2">User:</span>
                {report.user.firstName} {report.user.lastName}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Date:</span>
                {new Date(report.createdAt).toLocaleString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Duration:</span>{" "}
                {(
                  (report.endTime.getTime() - report.startTime.getTime()) /
                  (1000 * 60)
                ).toFixed(0)}{" "}
                minutes
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-semibold mr-2">Email:</span>
                {report.user.email}
              </div>
              <div className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Session ID:</span>{" "}
                {report.sessionId}
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Status:</span>{" "}
                <Badge variant="sucess">Completed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-5">Question Answers</h2>
      <div className="grid gap-6">
        {report.questions.map((question: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-md font-normal">
                Question {index + 1}: {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(question.answer) ? (
                <ul className="list-disc list-inside space-y-2">
                  {question.answer.map((answer: string, i: number) => (
                    <li key={i}>{answer}</li>
                  ))}
                </ul>
              ) : (
                <p>{question.answer}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
