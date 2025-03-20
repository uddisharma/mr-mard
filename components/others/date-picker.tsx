"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DatePicker() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from session storage
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/book");
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  const handleContinue = async () => {
    if (!date) {
      toast.warning("Please select a date to continue");
      return;
    }

    if (!userId) {
      toast.error("Authentication Error");
      router.push("/book");
      return;
    }

    setIsLoading(true);

    try {
      // Update user progress
      await fetch("/api/user-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          lastStep: "TIME_SELECTION",
          selectedDate: date.toISOString(),
        }),
      });

      // Store selected date in session storage
      sessionStorage.setItem("selectedDate", date.toISOString());

      // Redirect to time slot selection
      router.push("/appointment-booking/time");
    } catch (error) {
      toast.error("Failed to save your selection");
    } finally {
      setIsLoading(false);
    }
  };

  // Disable past dates
  const disabledDays = { before: new Date() };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select a Date</CardTitle>
        <CardDescription>Choose a date for your appointment</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          className="rounded-md border mx-auto"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/book")}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!date || isLoading}>
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
