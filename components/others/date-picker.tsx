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

export default function DatePicker({ id }: { id?: string | undefined | null }) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(id ?? null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/appointment-booking");
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
      router.push("/appointment-booking");
      return;
    }

    setIsLoading(true);

    try {
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
      sessionStorage.setItem("selectedDate", date.toISOString());
      router.push("/appointment-booking/time");
    } catch (error) {
      toast.error("Failed to save your selection");
    } finally {
      setIsLoading(false);
    }
  };

  const disabledDays = { before: new Date() };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select a Date</CardTitle>
        <CardDescription>Choose a date for your appointment</CardDescription>
      </CardHeader>
      <CardContent className="m-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          className="rounded-md border mx-auto w-fit"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/appointment-booking")}
        >
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!date || isLoading}>
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
