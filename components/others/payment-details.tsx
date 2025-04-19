"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface PaymentDetailsProps {
  orderId: string;
  amount: number;
  currency: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentDetails({
  orderId,
  amount,
  currency,
}: PaymentDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const router = useRouter();

  const handlePayment = () => {
    setIsLoading(true);

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load");
      setIsLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: currency,
      name: "Your Company Name",
      description: "Payment for Order #" + orderId,
      order_id: orderId,
      handler: (response: any) => {
        // Handle successful payment
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
        );
        router.push(
          `/payment/success?paymentId=${response.razorpay_payment_id}`,
        );
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Complete your payment to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span>{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>
                {currency} {amount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={isLoading || !isScriptLoaded}
          >
            {isLoading
              ? "Processing..."
              : `Pay ${currency} ${amount.toFixed(2)}`}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
