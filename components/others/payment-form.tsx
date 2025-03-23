"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/actions/payment";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Stepper4 } from "./step-indicator";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function PaymentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeSlotId, setTimeSlotId] = useState<string | null>(null);
  const [timeDate, setTimeDate] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });
  const [appointmentPrice, setAppointmentPrice] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedTimeSlotId = sessionStorage.getItem("selectedTimeSlotId");
    const storedPrice = sessionStorage.getItem("selectedTimeSlotPrice");
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedTime = sessionStorage.getItem("selectedTime");

    setTimeDate({
      date: storedDate || "",
      time: storedTime || "",
    });

    if (!storedUserId || !storedTimeSlotId) {
      router.push("/appointment-booking");
      return;
    }

    setUserId(storedUserId);
    setTimeSlotId(storedTimeSlotId);

    if (storedPrice) {
      setAppointmentPrice(Number.parseFloat(storedPrice).toString());
    }

    setIsFetching(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !timeSlotId) {
      toast.warning("Missing required information. Please start over.");
      router.push("/appointment-booking");
      return;
    }

    setIsLoading(true);

    try {
      const amountInPaise = Math.round(
        Number.parseFloat(appointmentPrice) * 100,
      );

      const order = await createOrder({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      if (!order.success) {
        throw new Error(order.error || "Failed to create order");
      }

      await loadRazorpayScript();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || order.keyId,
        amount: amountInPaise.toString(),
        currency: "INR",
        name: "Mr Mard",
        description: "Hair Solution",
        order_id: order.orderId,
        handler: (response: any) => {
          verifyPayment(
            response,
            amountInPaise,
            userId,
            timeSlotId,
            Number.parseFloat(appointmentPrice),
          );
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process payment",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (
    response: any,
    amount: number,
    userId: string,
    timeSlotId: string,
    appointmentPrice: number,
  ) => {
    try {
      const result = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          amount: amount,
        }),
      });
      const data = await result.json();

      if (data.success) {
        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            timeSlotId,
            paymentDetails: {
              method: "razorpay",
              amount: appointmentPrice,
              transactionId: response.razorpay_payment_id,
            },
          }),
        });

        if (!res.ok) {
          const errorData = res.headers
            .get("content-type")
            ?.includes("application/json")
            ? await res.json()
            : { error: "Unknown error occurred" };
          throw new Error(errorData.error || "Failed to create appointment");
        }

        const appointmentData = await res.json();
        sessionStorage.removeItem("selectedDate");
        sessionStorage.removeItem("selectedTimeSlotId");
        sessionStorage.removeItem("selectedTimeSlotPrice");
        sessionStorage.removeItem("selectedTime");
        sessionStorage.setItem("appointmentId", appointmentData.appointment.id);

        await router.push(
          `/appointment-booking/confirmation?paymentId=${response.razorpay_payment_id}`,
        );
      } else {
        throw new Error(data.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment could not be verified",
      );
    }
  };

  function timeLeftForSlot(date: string, timeSlot: string): string {
    const [startTime] = timeSlot.split(" - ");
    const match = startTime.match(/(\d+):(\d+)\s?(AM|PM)/);
    if (!match) return "Invalid time format";

    const [_, hour, minute, period] = match;

    let hours = parseInt(hour, 10);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const now = new Date();
    const target = new Date(date);
    target.setHours(hours, parseInt(minute, 10), 0, 0);

    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Time slot has expired";

    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${daysLeft} days, ${hoursLeft} hours, and ${minutesLeft} minutes`;
  }

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <Stepper4 />
          <motion.h1
            className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ lineHeight: "1.1" }} className="text-gradient ">
              Checkout your Appointment
            </span>
          </motion.h1>
          <motion.p
            className="mt-5 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Complete your booking by making a payment
          </motion.p>
          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg mt-5">
              <h2 className="text-lg font-semibold mb-4">
                Schedule Consultation
              </h2>
              <div className="mb-4">
                <p className="font-medium mb-2">Time & date</p>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCalendarAlt className="text-xl" />
                  <span>{timeDate?.date?.split("T")[0]}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 mt-2">
                  <FaClock className="text-xl" />
                  <span>{timeDate?.time}</span>
                </div>
                {timeDate?.date !== "" &&
                  timeDate?.time !== "" &&
                  timeLeftForSlot(timeDate?.date, timeDate?.time) !==
                    "Invalid time format" &&
                  (timeLeftForSlot(timeDate?.date, timeDate?.time) ===
                  "Time slot has expired" ? (
                    <p className="text-sm text-blue-600 mt-4 font-semibold">
                      Time slot has expired
                    </p>
                  ) : (
                    <p className="text-sm text-blue-600 mt-4">
                      This slot will be released in{" "}
                      <strong>
                        {timeLeftForSlot(timeDate?.date, timeDate?.time)}
                      </strong>
                    </p>
                  ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <p className="font-medium mb-2">Payment summary</p>
                <div className="flex justify-between text-gray-700">
                  <span>Screening Call</span>
                  <span>{formatCurrency(Number(appointmentPrice))}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-semibold mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(Number(appointmentPrice))}</span>
                </div>
              </div>

              <motion.div
                className="mt-8 flex items-center justify-between gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button
                  className="text-sm font-semibold leading-6 text-foreground flex items-center gap-1"
                  onClick={() => router.push("/appointment-booking/time")}
                >
                  <span aria-hidden="true">
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                  Back
                </button>
                <button
                  style={isLoading ? { cursor: "not-allowed" } : undefined}
                  className={`apple-button`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </button>
              </motion.div>
            </div>
          )}
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
