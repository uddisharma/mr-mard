"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, ChevronDown, Loader2 } from "lucide-react";
import { Stepper2 } from "./step-indicator";
import { cn, formatCurrency, formatTime } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  originalPrice: number;
  label: string;
  isActive: boolean;
}

type DateOption = {
  date: Date;
  day: string;
  dayNum: number;
  year: number;
  isSelected: boolean;
};

export default function DatePicker({ id }: { id?: string | undefined | null }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(id ?? null);
  const [dates, setDates] = useState<DateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSlot1, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dateScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/appointment-booking");
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  const handleContinue = async () => {
    if (!selectedDate) {
      toast.warning("Please select a date to continue");
      return;
    }

    if (!userId) {
      toast.error("Authentication Error");
      router.push("/appointment-booking");
      return;
    }

    setIsProcessing(true);

    try {
      await fetch("/api/user-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          lastStep: "PAYMENT",
          selectedDate: selectedDate,
          selectedTimeSlotId: selectedTimeSlot,
        }),
      });
      sessionStorage.setItem("selectedDate", selectedDate || "");
      sessionStorage.setItem("selectedTime", selectedSlot1 || "");
      sessionStorage.setItem("selectedTimeSlotId", selectedTimeSlot || "");
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
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const dateOptions: DateOption[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = date.getDate();

      dateOptions.push({
        date,
        day,
        dayNum,
        year: date.getFullYear(),
        isSelected: i === 1,
      });
    }

    setDates(dateOptions);
    setSelectedDate(dateOptions[1].date?.toISOString());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

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

  const handleDateSelect = (index: number) => {
    const newDates = dates.map((date, i) => ({
      ...date,
      isSelected: i === index,
    }));

    setDates(newDates);
    setSelectedDate(newDates[index].date?.toISOString());
    setSelectedTimeSlot(null);
  };

  const formatDisplayTime = (start: string, end: string) => {
    return `${formatTime(new Date(start))}`;
  };

  const monthShortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <Stepper2 />
          <motion.h1
            className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ lineHeight: "1.1" }} className="text-gradient ">
              Choose a Time Slot
            </span>
          </motion.h1>
          <motion.p
            className="mt-5 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Select a date and time for your appointment
          </motion.p>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="mt-5 md:mt-10 flex items-center gap-x-6 justify-between">
                <p className="text-sm font-semibold leading-6 text-btnblue flex justify-center items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-btnblue" /> Select
                  a Slot
                </p>
                <div className="flex items-center gap-x-2">
                  <del className="text-md leading-6 text-btnblue">
                    {selectedTimeSlot &&
                      formatCurrency(
                        Number(
                          timeSlots.find((slot) => slot.id === selectedTimeSlot)
                            ?.originalPrice,
                        ),
                      )}
                  </del>
                  <p className="text-md font-bold leading-6 text-btnblue">
                    {selectedTimeSlot &&
                      formatCurrency(
                        Number(
                          timeSlots.find((slot) => slot.id === selectedTimeSlot)
                            ?.price,
                        ),
                      )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-7 flex items-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div
              ref={dateScrollRef}
              className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar"
            >
              {dates.map((date, index) => (
                <div
                  key={index}
                  onClick={() => handleDateSelect(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-20 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all",
                    date.isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <span className="text-sm text-gray-500">{date.day}</span>
                  <span className="text-lg font-semibold">{date.dayNum}</span>
                  <span className="text-xs text-gray-500">
                    {monthShortNames[date.date?.getMonth()]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p
            className="mt-3 md:mt-8 text-sm bg-yellow leading-8 text-btnblue px-5 py-0.5 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Slots Opens 2 days earlier
          </motion.p>

          <motion.div className="mt-5 md:mt-8">
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
                  console.log("startTime", slot.startTime);
                  return (
                    <Popover key={slot.id}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={
                            selectedTimeSlot === slot.id ? "default" : "outline"
                          }
                          className="w-full flex gap-2"
                          disabled={!isAvailable}
                          onClick={() => {
                            setSelectedSlot(
                              dayjs.utc(slot.startTime).format("h:mm A"),
                            );
                            setSelectedTimeSlot(slot.id);
                          }}
                        >
                          {dayjs.utc(slot.startTime).format("h:mm A")}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <div className="">
                          <p className="text-sm font-medium">
                            {isAvailable
                              ? `${remainingSeats} seat${remainingSeats !== 1 ? "s" : ""} available`
                              : "No seats available"}
                          </p>
                          {slot?.label && (
                            <p className="text-sm  mt-1 text-[#9f6ef0] font-semibold">
                              {slot.label}
                            </p>
                          )}

                          {/* <del className="text-sm">
                            Original Price: {formatCurrency(slot.originalPrice)}
                          </del>
                          <p className="text-sm">
                            Discounted Price: {formatCurrency(slot.price)}
                          </p> */}
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
              onClick={() => router.push("/appointment-booking")}
            >
              <span aria-hidden="true">
                <ArrowLeft className="w-4 h-4" />
              </span>
              Back
            </button>
            <button
              style={
                !selectedDate || isLoading || !selectedTimeSlot
                  ? { cursor: "not-allowed" }
                  : undefined
              }
              className={`apple-button `}
              onClick={handleContinue}
              disabled={!selectedDate || isLoading || !selectedTimeSlot}
            >
              {isProcessing ? "Processing..." : "Continue"}
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
              src="/appointment/2.png"
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
