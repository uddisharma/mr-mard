"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { submitReport } from "@/actions/submit-report";

interface Question {
  id: number;
  text: string;
  questionType: "SINGLE_SELECT" | "MULTIPLE_SELECT" | "TEXT";
  options: {
    id: number;
    text: string;
  }[];
}

interface ReportFormProps {
  questions: Question[];
  userId: number;
}

export default function ReportForm({ questions, userId }: ReportFormProps) {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        userId,
        questions: questions.map((q) => ({
          question: q.text,
          answer: answers[q.id] || "",
        })),
      };
      const startTimeStr =
        localStorage.getItem("startTime") ?? new Date().toISOString();

      await submitReport(reportData, startTimeStr);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <Label>{question.text}</Label>
          {question.questionType === "SINGLE_SELECT" && (
            <RadioGroup
              onValueChange={(value: any) =>
                handleInputChange(question.id, value)
              }
              className="flex flex-col space-y-1"
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.text}
                    id={`q${question.id}-o${option.id}`}
                  />
                  <Label htmlFor={`q${question.id}-o${option.id}`}>
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {question.questionType === "MULTIPLE_SELECT" && (
            <div className="flex flex-col space-y-1">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`q${question.id}-o${option.id}`}
                    onCheckedChange={(checked) => {
                      const currentAnswers =
                        (answers[question.id] as string[]) || [];
                      if (checked) {
                        handleInputChange(question.id, [
                          ...currentAnswers,
                          option.text,
                        ]);
                      } else {
                        handleInputChange(
                          question.id,
                          currentAnswers.filter((text) => text !== option.text),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`q${question.id}-o${option.id}`}>
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {question.questionType === "TEXT" && (
            <Input
              type="text"
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  );
}
