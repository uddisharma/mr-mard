"use client";

import { useEffect, useState, useTransition } from "react";
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
import { registerWithOTP } from "@/actions/register-phone";
import { OtpVerification } from "@/actions/loginotp";

export default function PhoneVerification({
  phone,
  id,
}: {
  phone?: string | undefined | null;
  id?: string | undefined | null;
}) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(phone ? true : false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (phone && id) {
      sessionStorage.setItem("userId", id);
      router.push("/appointment-booking/date");
    }
  }, [phone]);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.warning("Please enter a valid phone number");
      return;
    }

    try {
      startTransition(async () => {
        const response = await registerWithOTP({ phone: phoneNumber });
        if (response.success) {
          toast.success(response.message);
          setIsOtpSent(true);
        } else {
          toast.error(response.message);
        }
      });
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning("Please enter the OTP sent to your phone");
      return;
    }

    try {
      startTransition(async () => {
        const res = await OtpVerification({ phone: phoneNumber, otp });
        if (!res?.success && !res?.redirect) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
        }
        if (res?.id) {
          sessionStorage.setItem("userId", res.id);
          router.push("/appointment-booking/date");
        } else {
          toast.error("User ID is missing.");
        }
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to verify OTP",
      );
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
                disabled={isPending}
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
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Verification Code"}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleVerifyOtp}
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
