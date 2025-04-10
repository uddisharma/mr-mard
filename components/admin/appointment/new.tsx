"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { CalendarIcon, Loader2, Phone, User } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatCurrency } from "@/lib/utils";
import CopyInput from "./copy";

dayjs.extend(utc);
dayjs.extend(timezone);

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

export default function NewAppointmentPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userFound, setUserFound] = useState(false);

  const [dates, setDates] = useState<DateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [submitted, setSummitted] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const dateOptions: DateOption[] = [];

    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = date.getDate();

      dateOptions.push({
        date,
        day,
        dayNum,
        year: date.getFullYear(),
        isSelected: i === 0,
      });
    }

    setDates(dateOptions);
    setSelectedDate(dateOptions[0].date?.toISOString());
  }, []);

  // Fetch time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTimeSlots = async (date: string) => {
    setIsLoadingTimeSlots(true);
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
      setIsLoadingTimeSlots(false);
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

  const searchUserByPhone = async () => {
    if (!phone || phone.length < 10) {
      toast.warning("Please enter a valid phone number");
      return;
    }

    setIsUserLoading(true);
    try {
      const response = await fetch(`/api/users/search?phone=${phone}`);

      if (!response.ok) {
        throw new Error("Failed to search for user");
      }

      const data = await response.json();

      if (data.user) {
        // User found
        setUserId(data.user.id);
        setUserName(data.user.name || "");
        setEmail(data.user.email || "");
        setUserFound(true);
      } else {
        // User not found
        setUserId(null);
        setUserName("");
        setEmail("");
        setUserFound(false);
        toast.info("User not found. Please enter user details.");
      }
      setSummitted(true);
    } catch (error) {
      toast.error("Error searching for user");
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTimeSlot) {
      toast.warning("Please select a date and time slot");
      return;
    }

    if (!phone || phone.length < 10) {
      toast.warning("Please enter a valid phone number");
      return;
    }

    if (!userFound && !userName) {
      toast.warning("Please enter user name");
      return;
    }

    setIsProcessing(true);

    try {
      // First create or update user
      const userResponse = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId, // Will be null for new users
          name: userName,
          phone,
          email,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to save user information");
      }

      const userData = await userResponse.json();
      const newUserId = userData.id;

      const appointmentResponse = await fetch("/api/appointments/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: newUserId,
          timeSlotId: selectedTimeSlot,
        }),
      });

      if (!appointmentResponse.ok) {
        throw new Error("Failed to create appointment");
      }

      const appointmentData = await appointmentResponse.json();
      const appointmentLink = `https://mrmard.in/appointment-booking/payment?id=${appointmentData.appointment.id}`;
      setLink(appointmentLink);
      toast.success("Appointment link generated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
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
    <Card className="w-full p-0 m-0 border-none shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">User Information</h3>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={10}
                    minLength={10}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      let sanitizedValue = input.value.replace(/\D/g, "");
                      if (sanitizedValue.startsWith("0")) {
                        sanitizedValue = sanitizedValue.slice(1);
                      }
                      setPhone(sanitizedValue);
                    }}
                    className="pl-10"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={searchUserByPhone}
                  disabled={isUserLoading}
                >
                  {isUserLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Search
                </Button>
              </div>
            </div>

            {submitted && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter user name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Date Selection</h3>
            <div className="flex gap-2">
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
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Time Slot Selection</h3>

            {isLoadingTimeSlots ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No available time slots for this date.
                </p>
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
                          className="w-full flex gap-2"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTimeSlot(slot.id)}
                        >
                          {dayjs.utc(slot.startTime).format("h:mm A")}
                          <CalendarIcon className="h-4 w-4" />
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
                            <p className="text-sm mt-1 text-primary font-semibold">
                              {slot.label}
                            </p>
                          )}
                          <p className="text-sm mt-1">
                            <span className="line-through mr-2">
                              {formatCurrency(slot.originalPrice)}
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(slot.price)}
                            </span>
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 mt-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full">
          <Link href="/admin/appointments">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={
              isProcessing ||
              !selectedTimeSlot ||
              !phone ||
              (!userFound && !userName)
            }
            className="ml-2"
          >
            {isProcessing ? "Generating..." : "Generate Link"}
          </Button>
        </div>

        {link && (
          <div className="w-full">
            <CopyInput value={link} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
