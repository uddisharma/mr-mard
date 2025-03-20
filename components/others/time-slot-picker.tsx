"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  isActive: boolean;
}

export default function TimeSlotPicker() {
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID and selected date from session storage
    const storedUserId = sessionStorage.getItem("userId");
    const storedDate = sessionStorage.getItem("selectedDate");

    if (!storedUserId || !storedDate) {
      router.push("/book");
      return;
    }

    setUserId(storedUserId);
    setSelectedDate(storedDate);

    // Fetch time slots for the selected date
    fetchTimeSlots(storedDate);
  }, [router]);

  const fetchTimeSlots = async (date: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/time-slots?date=${encodeURIComponent(date)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      toast.error("Failed to load available time slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedTimeSlot) {
      toast.warning("Please select a time slot to continue");
      return;
    }

    if (!userId) {
      toast.warning("Please verify your phone number first");
      router.push("/book");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update user progress
      await fetch("/api/user-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          lastStep: "PAYMENT",
          selectedTimeSlotId: selectedTimeSlot,
        }),
      });

      // Store selected time slot in session storage
      sessionStorage.setItem("selectedTimeSlotId", selectedTimeSlot);

      // Find the selected time slot to store its price
      const selectedSlot = timeSlots.find(
        (slot) => slot.id === selectedTimeSlot,
      );
      if (selectedSlot) {
        sessionStorage.setItem(
          "selectedTimeSlotPrice",
          selectedSlot.price.toString(),
        );
      }

      // Redirect to payment page
      router.push("/book/payment");
    } catch (error) {
      toast.error("Failed to save your selection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDisplayTime = (start: string, end: string) => {
    return `${formatTime(new Date(start))} - ${formatTime(new Date(end))}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select a Time Slot</CardTitle>
        <CardDescription>
          {selectedDate
            ? `Available times for ${formatDate(new Date(selectedDate))}`
            : "Choose a time for your appointment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No available time slots for this date.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/book/date")}
            >
              Choose Another Date
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => {
              const isAvailable = slot.bookedSeats < slot.totalSeats;
              const remainingSeats = slot.totalSeats - slot.bookedSeats;

              return (
                <Popover key={slot.id}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={
                        selectedTimeSlot === slot.id ? "default" : "outline"
                      }
                      className="w-full"
                      disabled={!isAvailable}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                    >
                      {formatDisplayTime(slot.startTime, slot.endTime)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {isAvailable
                          ? `${remainingSeats} seat${remainingSeats !== 1 ? "s" : ""} available`
                          : "No seats available"}
                      </p>
                      <p className="text-sm">
                        Price: {formatCurrency(slot.price)}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/book/date")}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedTimeSlot || isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
