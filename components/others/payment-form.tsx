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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function PaymentForm() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeSlotId, setTimeSlotId] = useState<string | null>(null);
  const [appointmentPrice, setAppointmentPrice] = useState(50.0);

  useEffect(() => {
    // Get user ID and selected time slot from session storage
    const storedUserId = sessionStorage.getItem("userId");
    const storedTimeSlotId = sessionStorage.getItem("selectedTimeSlotId");
    const storedPrice = sessionStorage.getItem("selectedTimeSlotPrice");

    if (!storedUserId || !storedTimeSlotId) {
      router.push("/book");
      return;
    }

    setUserId(storedUserId);
    setTimeSlotId(storedTimeSlotId);

    // Set the price from session storage if available
    if (storedPrice) {
      setAppointmentPrice(Number.parseFloat(storedPrice));
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !timeSlotId) {
      toast.warning("Missing required information. Please start over.");
      router.push("/book");
      return;
    }

    // Basic validation
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.warning("Please fill in all payment details");
        return;
      }
    }

    setIsLoading(true);

    try {
      // In a real app, you would process payment with a payment provider
      // This is a mock implementation

      // Create a mock payment transaction ID
      const mockTransactionId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create appointment with payment details
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          timeSlotId,
          paymentDetails: {
            method: paymentMethod,
            amount: appointmentPrice,
            transactionId: mockTransactionId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create appointment");
      }

      const data = await response.json();

      // Clear session storage
      sessionStorage.removeItem("selectedDate");
      sessionStorage.removeItem("selectedTimeSlotId");
      sessionStorage.removeItem("selectedTimeSlotPrice");

      // Store appointment ID for confirmation page
      sessionStorage.setItem("appointmentId", data.appointment.id);

      // Redirect to confirmation page
      router.push("/book/confirmation");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process payment",
      );
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="text-2xl font-bold">
              {formatCurrency(appointmentPrice)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "credit-card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="bg-muted p-4 rounded-md text-center">
              <p className="text-sm text-muted-foreground">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/book/time")}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
