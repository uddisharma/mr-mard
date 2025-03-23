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
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    const storedUserId = sessionStorage.getItem("userId");
    const storedDate = sessionStorage.getItem("selectedDate");

    if (!storedUserId || !storedDate) {
      router.push("/appointment-booking");
      return;
    }

    setUserId(storedUserId);
    setSelectedDate(storedDate);

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
      router.push("/appointment-booking");
      return;
    }

    setIsSubmitting(true);

    try {
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

      sessionStorage.setItem("selectedTimeSlotId", selectedTimeSlot);

      const selectedSlot = timeSlots.find(
        (slot) => slot.id === selectedTimeSlot,
      );
      if (selectedSlot) {
        sessionStorage.setItem(
          "selectedTimeSlotPrice",
          selectedSlot.price.toString(),
        );
      }

      router.push("/appointment-booking/payment");
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
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <motion.h1
            className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ lineHeight: "1.1" }} className="text-gradient ">
              Choose a Specific Time Slot
            </span>
          </motion.h1>
          <motion.p
            className="mt-5 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Select a time slot that works best for you. If you don't see a time
            that works for you, please contact us.
          </motion.p>
          <motion.div
            className="mt-7 flex flex-col items-center gap-x-6 rounded-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
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
                  onClick={() => router.push("/appointment-booking/date")}
                >
                  Choose Another Date
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 grid-cols-2 gap-3 justify-center">
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
          </motion.div>

          <motion.div
            className="mt-8 flex items-center justify-between gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              className="text-sm font-semibold leading-6 text-foreground flex items-center gap-1"
              onClick={() => router.push("/appointment-booking/date")}
            >
              <span aria-hidden="true">
                <ArrowLeft className="w-4 h-4" />
              </span>
              Back
            </button>
            <button
              style={
                !selectedTimeSlot || isSubmitting
                  ? { cursor: "not-allowed" }
                  : undefined
              }
              className={`apple-button `}
              onClick={handleContinue}
              disabled={!selectedTimeSlot || isSubmitting}
            >
              {isLoading ? "Processing..." : "Continue"}
            </button>
          </motion.div>
        </div>
        <motion.div
          className="mx-auto mt-16 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creative-SW6QDQbcVuwPgb6a2CYtYmRbsJa4k1.png"
              alt="Flowers & Saints design concept"
              width={600}
              height={600}
              className="w-[500px] rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
