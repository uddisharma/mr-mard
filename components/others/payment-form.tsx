"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/actions/payment";
import { motion } from "framer-motion";
import { ArrowLeft, IndianRupee, ReceiptIndianRupee } from "lucide-react";
import { Stepper4 } from "./step-indicator";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const [originalPrice, setOriginalPrice] = useState("");

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
    const storedOriginalPrice = sessionStorage.getItem(
      "selectedTimeSlotOriginalPrice",
    );
    setOriginalPrice(storedOriginalPrice || "");

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
        name: "Milele Health",
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
    return `${daysLeft > 0 ? `${daysLeft} days, ` : ""}${
      hoursLeft > 0 ? `${hoursLeft} hours, ` : ""
    }${minutesLeft} minutes`;
  }

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <Stepper4 />
          <motion.h1
            className="mt-5 text-2xl md:text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ lineHeight: "1.1" }} className="text-gradient ">
              Confirm your Appointment
            </span>
          </motion.h1>
          <motion.p
            className="mt-2 md:mt-5 text-md md:text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Block your appointment by completing the payment
          </motion.p>
          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg mt-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold mb-4">
                  Appointment Details
                </h2>
              </div>
              <div className="mb-4">
                <p className="font-medium mb-2">Time & date</p>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCalendarAlt className="text-xl" />
                  <span>
                    {dayjs(timeDate?.date)
                      .tz("Asia/Kolkata")
                      .format("ddd, MMMM D, YYYY")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 mt-2">
                  <FaClock className="text-xl" />
                  <span>{timeDate?.time}</span>
                </div>
                {/* {timeDate?.date !== "" &&
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
                  ))} */}
              </div>

              <div className="border-t pt-4 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Payment summary</p>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Original Price</span>
                  <del className="text-gray-500">
                    {formatCurrency(Number(originalPrice))}
                  </del>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Hair diagnosis call</span>
                  <span>{formatCurrency(Number(appointmentPrice))}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(Number(appointmentPrice))}</span>
                </div>
                <div className="text-[#1c5f2a] bg-green-50 p-1 pl-2 rounded-md">
                  <span>Total Savings </span>
                  <span>
                    {formatCurrency(
                      Number(originalPrice) - Number(appointmentPrice),
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-yellow border border-yellow-100 rounded-xl p-4 shadow-sm w-full max-w-md">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Refund policy
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      If you're not fully satisfied, we’ll give you a 100%
                      refund.
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-yellow-100">
                    <IndianRupee className="text-btnblue font-bold" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1c5f2a] mt-8 text-white px-4 py-2 rounded-md flex items-center space-x-2 w-full max-w-md">
                <ReceiptIndianRupee className="w-4 h-4" />
                <span className="text-sm font-normal">
                  Total savings{" "}
                  <span className="font-semibold">
                    {formatCurrency(
                      Number(originalPrice) - Number(appointmentPrice),
                    )}
                  </span>
                </span>
              </div>
              <motion.div
                className="mt-3 flex items-center justify-between gap-x-6"
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
                  style={isLoading ? { cursor: "not-allowed" } : undefined}
                  className={`apple-button`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm & Pay"}
                </button>
              </motion.div>
            </div>
          )}
        </div>
        <motion.div
          className="mx-auto mt-16 lg:mt-0 hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <img
              src="/appointment/3.png"
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
