"use client";

import type React from "react";
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
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { createOrder } from "@/actions/payment";

export default function PaymentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeSlotId, setTimeSlotId] = useState<string | null>(null);
  const [appointmentPrice, setAppointmentPrice] = useState("50");

  // Load Razorpay SDK
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your booking by making a payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 flex justify-center">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(appointmentPrice))}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/appointment-booking/time")}
        >
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
