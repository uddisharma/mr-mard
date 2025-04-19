"use client";

import { useState } from "react";
import { createPaymentOrder } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function CreatePaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    order: { id: string; amount: number } | undefined;
    qrCode: string;
    paymentUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createPaymentOrder(formData);

      if (!response.success) {
        setError(
          "error" in response
            ? response.error || "Failed to create payment order"
            : "Failed to create payment order",
        );
        return;
      }

      if ("data" in response) {
        if (response.data && "order" in response.data) {
          setPaymentData({
            ...response.data,
            order:
              response.data.order && typeof response.data.order === "string"
                ? JSON.parse(response.data.order)
                : response.data.order,
          });
        } else {
          setError("Invalid response data");
        }
      } else {
        setError(response.error || "Failed to create payment order");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Payment QR Code</CardTitle>
        <CardDescription>
          Enter an amount to generate a QR code for payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!paymentData ? (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (INR)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                required
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate QR Code"}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <Image
                  src={paymentData.qrCode || "/placeholder.svg"}
                  alt="Payment QR Code"
                  width={250}
                  height={250}
                  className="mx-auto"
                />
              </div>
              <div className="text-center space-y-2">
                {paymentData.order && (
                  <p className="font-medium">
                    Order ID: {paymentData.order.id}
                  </p>
                )}
                {paymentData.order && (
                  <p>Amount: ₹{(paymentData.order.amount / 100).toFixed(2)}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Scan the QR code or share the payment link:
              </p>
              <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm truncate mr-2">
                  {paymentData.paymentUrl}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(paymentData.paymentUrl);
                    alert("Payment URL copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {paymentData && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setPaymentData(null)}
          >
            Create New Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
