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
import Report from "@/components/others/report";
import Image from "next/image";

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

  const { id } = params;
  const data = await db.analysis.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      report: true,
    },
  });

  if (!data) notFound();

  const report = data?.report;
  if (!report) notFound();

  const questions = report.questions;
  const user = data?.user;
  //@ts-ignore
  const analysisData = data?.analysis?.analysis;

  // Calculate duration safely
  const startTime = new Date(report.startTime);
  const endTime = new Date(report.endTime);
  const durationInMinutes = Math.max(
    0,
    Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)),
  );
  const time = durationInMinutes.toString();

  const enhancedData = {
    ...data,
    overall_score: analysisData.overall_score?.toFixed(0) || 75,
    estimated_hair_count: analysisData.estimated_hair_count || 95675,
    metrics: {
      "Hair Thickness": 80,
      Oiliness: 65,
      "Hair Density": 78,
      "Scalp Coverage": 85,
      Dryness: 70,
      "Hair Type Adjustment": 75,
    },
    hairCount: {
      current: 91000,
      average: 100000,
    },
    hairScore: {
      current: 75,
      average: 70,
    },
    recommendations: [
      "Better hair coverage.",
      "Dryness in top 70%; hydrate more.",
      "Hair density improved; more growth",
      "No dandruff.",
    ],
  };

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
                {user?.firstName} {user?.lastName}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Date:</span>
                {new Date(data?.createdAt).toLocaleString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Duration:</span>{" "}
                {Number(time) <= 0 ? "Less than a minute" : `${time} minutes`}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-semibold mr-2">Email:</span>
                {user?.email}
              </div>
              <div className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-medium mr-2">Session ID:</span>{" "}
                {report?.sessionId}
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
      {questions && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Question Answers</CardTitle>
              <CardDescription>
                Answers to the questions asked during the analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {questions.map((question: any, index: number) => (
                  <div
                    key={index}
                    className="border-b last:border-0 pb-6 last:pb-0"
                  >
                    <h3 className="text-md font-medium mb-3">
                      Question {index + 1}: {question.question}
                    </h3>
                    {Array.isArray(question.answer) ? (
                      <ul className="list-disc list-inside space-y-2">
                        {question.answer.map((answer: string, i: number) => (
                          <li key={i}>{answer}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{question.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {enhancedData && (
        <>
          <Card className="mt-8 md:hidden block">
            <CardHeader>
              <CardTitle className="text-xl">Analysis Details</CardTitle>
              <CardDescription>
                Detailed metrics and recommendations from the analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Overall Score
                    </h3>
                    <div className="text-4xl font-bold text-btnblue">
                      {enhancedData.overall_score}/100
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Hair Count</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current</span>
                        <span className="font-medium">
                          {enhancedData.hairCount.current.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average</span>
                        <span className="font-medium">
                          {enhancedData.hairCount.average.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Hair Score</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current</span>
                        <span className="font-medium">
                          {enhancedData.hairScore.current}/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average</span>
                        <span className="font-medium">
                          {enhancedData.hairScore.average}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Metrics</h3>
                    <div className="space-y-4">
                      {Object.entries(enhancedData.metrics).map(
                        ([name, value]: [string, any]) => (
                          <div key={name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{name}</span>
                              <span className="text-gray-500">{value}/100</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-btnblue rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recommendations
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {enhancedData.recommendations.map(
                        (rec: string, index: number) => (
                          <li key={index} className="text-gray-600">
                            {rec}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="hidden md:block">
            <Report enhancedData={enhancedData} className="px-0" />
          </div>
        </>
      )}
      <div className="flex justify-center items-center">
        <Image
          //@ts-ignore
          src={data?.analysis?.image}
          alt={user?.firstName || "User"}
          height={500}
          width={500}
        />
      </div>
    </div>
  );
}
