"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PhoneVerification() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.warning("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    // In a real app, you would call an API to send OTP
    // This is a mock implementation
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      toast.success("Use 123456 as the OTP code for testing");
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning("Please enter the OTP sent to your phone");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Store user ID in session storage
      sessionStorage.setItem("userId", data.userId);

      // Redirect to date selection
      router.push("/book/date");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to verify OTP",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Phone Number</CardTitle>
        <CardDescription>
          {isOtpSent
            ? "Enter the verification code sent to your phone"
            : "We'll send a verification code to your phone"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOtpSent ? (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <p className="text-sm text-muted-foreground">
              Didn't receive a code?{" "}
              <button
                className="text-primary underline"
                onClick={() => handleSendOtp()}
                disabled={isLoading}
              >
                Resend
              </button>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isOtpSent ? (
          <Button
            className="w-full"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
