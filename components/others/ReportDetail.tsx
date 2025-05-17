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
import {
  User,
  Mail,
  Calendar,
  Clock,
  HelpCircle,
  Brain,
  Ruler,
  Droplet,
  Gauge,
  BellRing,
} from "lucide-react";
import Link from "next/link";

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

  const time = (
    (report.endTime.getTime() - report.startTime.getTime()) /
    (1000 * 60)
  ).toFixed(0);

  const hairAnalysis = {
    density: 2.9889322916666665,
    scaled_density: 22.849085334616657,
    coverage: {
      overall: 0.06324894726276398,
      frontal: 0.03897280618548393,
      crown: 0.12222326546907425,
    },
    regional_densities: [
      0, 4.553990610328638, 0, 1.6490610328638498, 20.560446009389672,
      0.1789906103286385, 0, 0, 0,
    ],
    hair_type: "Dreadlocks",
    hair_type_confidence: 0.5111266374588013,
    density_class: "Medium",
    hair_condition: "dry",
    condition_confidence: 0.37282171845436096,
    overall_score: 48.09778645833333,
    future_prediction: {},
  };

  return (
    <div className="mx-auto md:max-w-5xl pb-20 px-4 space-y-8">
      {/* User Details Card */}
      <h3 className="text-2xl font-bold text-btnblue text-center">
        Hair analysis report
      </h3>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>Personal and session details</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 opacity-70" />
              <span className="font-medium">Name:</span>
              <span>
                {report.user.firstName} {report.user.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 opacity-70" />
              <span className="font-medium">Email:</span>
              <span>{report.user.email}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 opacity-70" />
              <span className="font-medium">Session Date:</span>
              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 opacity-70" />
              <span className="font-medium">Duration:</span>
              {Number(time) <= 0 ? (
                <span>Less then 1 minute</span>
              ) : (
                <span>{time} minutes</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions and Answers Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Questionnaire Responses
          </CardTitle>
          <CardDescription>
            User's answers to assessment questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {report.questions.map((question: any, index: number) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium mb-2">
                Q{index + 1}: {question.question}
              </h3>
              {Array.isArray(question.answer) ? (
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {question.answer.map((answer: string, i: number) => (
                    <li key={i}>{answer}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-4">{question.answer}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hair Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Hair Analysis Results
          </CardTitle>
          <CardDescription>
            Detailed analysis of hair characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Overall Metrics
              </h3>
              <div className="grid gap-2 ml-6">
                <div className="flex justify-between">
                  <span>Overall Score:</span>
                  <span className="font-medium">
                    {hairAnalysis.overall_score.toFixed(2)}
                  </span>
                </div>
                <div className="justify-between hidden md:flex">
                  <span>Hair Type:</span>
                  <div className="md:flex items-center justify-end gap-2">
                    <span className="font-medium">
                      {hairAnalysis.hair_type}
                    </span>
                    <span className="text-xs text-muted-foreground hidden md:block">
                      ({(hairAnalysis.hair_type_confidence * 100).toFixed(1)}%
                      Confidence)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between md:hidden">
                  <span>Hair Type:</span>
                  <span className="font-medium">{hairAnalysis.hair_type}</span>
                </div>
                <div className="flex justify-between md:hidden">
                  <span>Hair Type Confidence:</span>
                  <span className="font-medium">
                    {(hairAnalysis.hair_type_confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Density Class:</span>
                  <span className="font-medium">
                    {hairAnalysis.density_class}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Density Measurements
              </h3>
              <div className="grid gap-2 ml-6">
                <div className="flex justify-between">
                  <span>Base Density:</span>
                  <span className="font-medium">
                    {hairAnalysis.density.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Scaled Density:</span>
                  <span className="font-medium">
                    {hairAnalysis.scaled_density.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Coverage Analysis
              </h3>
              <div className="grid gap-2 ml-6">
                <div className="flex justify-between">
                  <span>Overall Coverage:</span>
                  <span className="font-medium">
                    {(hairAnalysis.coverage.overall * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frontal Coverage:</span>
                  <span className="font-medium">
                    {(hairAnalysis.coverage.frontal * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Crown Coverage:</span>
                  <span className="font-medium">
                    {(hairAnalysis.coverage.crown * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Condition Assessment</h3>
              <div className="grid gap-2 ml-6">
                <div className="flex justify-between">
                  <span>Hair Condition:</span>
                  <span className="font-medium capitalize">
                    {hairAnalysis.hair_condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Condition Confidence:</span>
                  <span className="font-medium">
                    {(hairAnalysis.condition_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Prediction Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Future Prediction
          </CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
            commodi veniam sapiente culpa eaque explicabo id officia, provident
            cum quas corrupti fugit voluptate, unde incidunt voluptatum?
            Sapiente nisi libero ipsam sint saepe veniam cupiditate quibusdam,
            quae eligendi, numquam animi laudantium? Consequuntur eos nisi
            tempore eius enim, ad laboriosam sit harum.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Hair Care Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Hair Care Recommendations
          </CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque,
            fugit. Ratione explicabo natus nulla tempore hic porro dolore
            placeat quo! Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Modi et praesentium odit, facilis dolore voluptatum quo
            reiciendis placeat nam inventore magni debitis iure assumenda ea
            quia totam, ullam animi rem!
            <Link href="/appointment-booking">
              <div className="mt-5 mx-auto w-max bg-black text-white px-20 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition duration-300">
                Book Consultation
              </div>
            </Link>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
