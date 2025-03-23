"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { createOrder } from "@/actions/payment";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PaymentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeSlotId, setTimeSlotId] = useState<string | null>(null);
  const [appointmentPrice, setAppointmentPrice] = useState("50");

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

    if (!storedUserId || !storedTimeSlotId) {
      router.push("/appointment-booking");
      return;
    }

    setUserId(storedUserId);
    setTimeSlotId(storedTimeSlotId);

    if (storedPrice) {
      setAppointmentPrice(Number.parseFloat(storedPrice).toString());
    }
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
              Pay Fee for your Appointment
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

          <motion.div
            className="mt-7 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 flex justify-center"
            >
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="text-2xl font-bold">
                  {formatCurrency(Number(appointmentPrice))}
                </div>
              </div>
            </form>
          </motion.div>

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
