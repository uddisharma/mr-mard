"use client";
import React, { useEffect, useState, useTransition } from "react";
import AnalyticsIllustration from "@/components/others/analytics-illustrations";
import ProgressDots from "@/components/others/progress-dots";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { submitReport } from "@/actions/submit-report";
import { toast } from "sonner";
import FaceDetection from "./face-detection";

interface Option {
  id: number;
  questionId: number;
  text: string;
  sequence: number;
  isActive: boolean;
  isDeleted: boolean;
}

interface Question {
  id: number;
  text: string;
  sequence: number;
  questionType: "SINGLE_SELECT" | "MULTIPLE_SELECT" | "TEXT";
  required: boolean;
  options: Option[];
}

const MultiStepForm = ({ data }: { data: Question[] }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Record<number, string | string[]>>(
    {},
  );
  const [errors, setErrors] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<number>(0);
  const [reportId, setReportId] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("startTime", JSON.stringify(new Date().toISOString()));
    const reportData = localStorage.getItem("reportId");
    if (reportData) {
      const { step, reportId } = JSON.parse(reportData);
      setStep(step);
      setReportId(Number(reportId));
    }
  }, []);

  const handleOptionChange = (
    questionId: number,
    value: string,
    isMultiple: boolean,
  ): void => {
    setResponses((prev) => {
      const existing = prev[questionId] || (isMultiple ? [] : "");
      if (isMultiple) {
        const updated = (existing as string[]).includes(value)
          ? (existing as string[]).filter((v) => v !== value)
          : [...(existing as string[]), value];
        return { ...prev, [questionId]: updated };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleNext = (): void => {
    const currentQuestion = data[currentStep];
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      setErrors("This question is required.");
      return;
    }
    setErrors("");
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = (): void => {
    setErrors("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (): void => {
    const questions = {
      questions: data.map((question) => ({
        question: question.text,
        answer:
          responses[question.id] ||
          (question.questionType === "TEXT" ? "" : []),
      })),
    };
    startTransition(async () => {
      const startTimeStr =
        localStorage.getItem("startTime") ?? new Date().toISOString();
      const res = await submitReport(questions, startTimeStr);
      if (res?.success && res?.reportId) {
        setResponses({});
        setCurrentStep(0);
        setStep(1);
        const data = {
          step: 1,
          reportId: String(res.reportId),
        };
        localStorage.setItem("reportId", JSON.stringify(data));
        localStorage.removeItem("startTime");
        setReportId(res.reportId);
      } else {
        toast.error(res.message);
      }
    });
  };

  const currentQuestion = data[currentStep];

  return (
    <div className="flex flex-col px-5 md:px-10 my-2 mb-20 md:mb-0 md:py-10">
      <main className="flex-1 md:px-4 md:py-12 w-full">
        <div className="grid md:grid-cols-2 justify-center gap-20 items-center">
          <div>
            <AnalyticsIllustration />
          </div>
          {step == 0 ? (
            <div>
              <ProgressDots total={data.length} current={currentStep} />
              <div className="space-y-10 mt-16">
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentQuestion.text}
                  </h1>
                  {/* <p className="mt-4 text-btnblue font-normal">
                  To get started, let us know your gender to provide insights
                  tailored to your unique hair profile.
                </p> */}
                </div>

                <div>
                  <div
                    className={`grid ${currentQuestion.questionType == "TEXT" ? "grid-cols-1" : "md:grid-cols-4 grid-cols-2"} sm:flex-row gap-4`}
                  >
                    {currentQuestion.questionType === "SINGLE_SELECT" &&
                      currentQuestion.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={
                            responses[currentQuestion.id] === option.text
                              ? "default"
                              : "outline"
                          }
                          className={`flex-1 border-[1px] border-black text-black bg-white ${
                            responses[currentQuestion.id] === option.text
                              ? "bg-btnblue text-white"
                              : ""
                          }`}
                          onClick={() =>
                            handleOptionChange(
                              currentQuestion.id,
                              option.text,
                              false,
                            )
                          }
                        >
                          {option.text}
                        </Button>
                      ))}
                    {currentQuestion.questionType === "MULTIPLE_SELECT" &&
                      currentQuestion.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={
                            (
                              responses[currentQuestion.id] as string[]
                            )?.includes(option.text)
                              ? "default"
                              : "outline"
                          }
                          className={`flex-1 border-[1px] border-black text-black bg-white ${
                            (
                              responses[currentQuestion.id] as string[]
                            )?.includes(option.text)
                              ? "bg-btnblue text-white"
                              : ""
                          }`}
                          onClick={() =>
                            handleOptionChange(
                              currentQuestion.id,
                              option.text,
                              true,
                            )
                          }
                        >
                          {option.text}
                        </Button>
                      ))}
                    {currentQuestion.questionType === "TEXT" && (
                      <Input
                        type="text"
                        className="border-[1px] border-black text-black bg-white"
                        placeholder="Enter your answer"
                        value={responses[currentQuestion.id] as string}
                        onChange={(e) =>
                          handleOptionChange(
                            currentQuestion.id,
                            e.target.value,
                            false,
                          )
                        }
                      />
                    )}
                  </div>
                  {errors && (
                    <p className="text-red-500 text-xs mt-3">{errors}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-5 mt-10">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="px-14"
                  >
                    Previous
                  </Button>
                )}
                {currentStep < data.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-btnblue text-white px-14"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    disabled={isPending}
                    onClick={handleSubmit}
                    className="bg-btnblue text-white px-14"
                  >
                    {isPending ? "Loading..." : "Next"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <FaceDetection reportId={reportId} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MultiStepForm;
