"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface AppointmentDetails {
  id: string;
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  transaction: {
    amount: number;
    status: string;
  };
}

export default function Confirmation() {
  const router = useRouter();
  const params = useSearchParams();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const paymentId = params.get("paymentId");

  useEffect(() => {
    const appointmentId = sessionStorage.getItem("appointmentId");

    if (!appointmentId) {
      router.push("/appointment-booking");
      return;
    }
    fetchAppointmentDetails(appointmentId);
  }, [router]);

  const fetchAppointmentDetails = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch appointment details");
      }

      const data = await response.json();
      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
        <CardDescription>
          Your appointment has been successfully booked
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointment ? (
          <>
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {formatDate(new Date(appointment.timeSlot.date))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {formatTime(new Date(appointment.timeSlot.startTime))} -{" "}
                  {formatTime(new Date(appointment.timeSlot.endTime))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-medium">
                  {appointment.id.substring(0, 16).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment ID:</span>
                <span className="font-medium">{paymentId?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="font-medium text-green-600">
                  {appointment.transaction.status === "COMPLETED"
                    ? "Paid"
                    : "Pending"}
                </span>
              </div>
            </div>
          </>
        ) : !isLoading ? (
          <div className="bg-muted p-4 rounded-md text-center">
            <p>
              Your booking has been confirmed. A confirmation email will be sent
              shortly.
            </p>
          </div>
        ) : null}

        <div className="text-center text-sm text-muted-foreground">
          <p>Need to make changes to your appointment?</p>
          <p>Contact us at +91 8861452659</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </CardFooter>
    </Card>
  );
}
