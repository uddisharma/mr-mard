"use client";

import { loginOTP } from "@/actions/loginotp";
import { registerWithOTP } from "@/actions/register-phone";
import { decryptPhoneNumber } from "@/lib/encryption";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function VerificationPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isPending, startTransition] = useTransition();
  const [isResending, startTransition1] = useTransition();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState({
    signupSuccess: false,
    verifySuccess: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const decryptPhone = searchParams.get("token") ?? "";
  const phone = decryptPhoneNumber(decryptPhone) ?? "";

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 4) {
      return toast.error("Please enter a valid OTP.");
    }
    startTransition(async () => {
      const res = await loginOTP({ phone, otp: otpString });
      if (!res?.success && !res?.redirect) {
        toast.error(res.message);
      } else if (res?.redirect) {
        setStatus({ signupSuccess: false, verifySuccess: true });
      } else {
        setStatus({ signupSuccess: true, verifySuccess: true });
        toast.success(res.message);
      }
    });
  };

  const handleResendOTP = async () => {
    if (isResending || timeLeft > 0) return;
    setIsActive(true);
    startTransition1(() => {
      registerWithOTP({ phone }).then((data) => {
        if (!data.success) {
          return toast.error(data.message);
        }
        setTimeLeft(30);
        toast.success(data.message);
      });
    });
  };

  useEffect(() => {
    if (status?.signupSuccess && status?.verifySuccess) {
      setTimeout(() => {
        router.push(
          `${searchParams?.get("redirect") ? `&redirect=${searchParams.get("redirect")}` : "/analyze"}`,
        );
      }, 2000);
    }
    if (!status?.signupSuccess && status?.verifySuccess) {
      setTimeout(() => {
        router.push(`/signup?token=${decryptPhone}`);
      }, 3000);
    }
  }, [status]);

  return (
    <div className="flex justify-center items-center px-4 py-12">
      {!status?.signupSuccess && !status?.verifySuccess ? (
        <div className="w-full max-w-md bg-yellow rounded-lg p-8 shadow-lg">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-semibold text-btnblue">
              Verification
            </h1>
            <p className="text-gray-600">
              Enter your 4 digits code that you received on your number.
            </p>
          </div>

          <form onSubmit={(e) => handleVerify(e)} className="space-y-8">
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl border-[1px] border-black rounded-lg focus:border-btnblue focus:outline-none bg-yellow"
                />
              ))}
            </div>

            <div className="text-center text-orange">
              {formatTime(timeLeft)}
            </div>

            <Button
              type="submit"
              className="w-full bg-btnblue hover:bg-btnblue/80 text-white py-6"
              disabled={isPending || otp.some((digit) => digit === "")}
            >
              {isPending ? "Verifying..." : "Next"}
            </Button>

            <div className="text-center space-x-1">
              <span className="text-gray-500">
                If you didn’t receive a code!
              </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending || timeLeft > 0}
                className={`text-orange hover:underline focus:outline-none ${isResending || timeLeft > 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isResending ? "Resending..." : "Resend"}
              </button>
            </div>
          </form>
        </div>
      ) : status?.verifySuccess && !status?.signupSuccess ? (
        <div className="w-full max-w-md bg-white border border-btnblue rounded-lg p-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full border-[#C2CDE0] border-[7px] flex items-center justify-center mb-2">
              <Check className="w-10 h-10 text-btnblue" />
            </div>

            <h1 className="text-[32px] font-medium text-btnblue">
              Successfully
            </h1>

            <p className="text-gray-500 mb-6">Contact number verified</p>
            <Link
              className="w-full bg-btnblue text-white rounded-lg hover:bg-btnblue transition-colors"
              href={`/signup${decryptPhone ? `?token=${decryptPhone}${searchParams?.get("redirect") ? `&redirect=${searchParams.get("redirect")}` : ""}` : ""}`}
            >
              <button className="w-full bg-btnblue text-white py-3.5 rounded-lg hover:bg-btnblue transition-colors">
                Continue Sign up
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white border border-btnblue rounded-lg p-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full border-[#C2CDE0] border-[7px] flex items-center justify-center mb-2">
              <Check className="w-10 h-10 text-btnblue" />
            </div>
            <h1 className="text-[32px] font-medium text-btnblue">
              Successfully
            </h1>
            <p className="text-gray-500 mb-6">Logged in you account</p>
            <Link
              className="w-full bg-btnblue text-white  rounded-lg hover:bg-btnblue transition-colors"
              href={`${searchParams?.get("redirect") ? `&redirect=${searchParams.get("redirect")}` : "/profile"}`}
            >
              <button className="w-full bg-btnblue text-white py-3.5 rounded-lg hover:bg-btnblue transition-colors">
                Continue
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
