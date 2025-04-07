"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerWithOTP } from "@/actions/register-phone";
import { OtpVerification, UpsertUserProgress } from "@/actions/loginotp";
import { motion } from "framer-motion";
import { Stepper1 } from "./step-indicator";

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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (phone && id) {
      sessionStorage.setItem("userId", id);
      UpsertUserProgress(id);
      router.push("/appointment-booking/date");
    }
  }, [phone]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

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
          setResendTimer(30);
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
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <Stepper1 />
          <motion.h1
            className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ lineHeight: "1.1" }} className="text-gradient ">
              Book Your Appointment{" "}
            </span>
          </motion.h1>
          <motion.p
            className="mt-5 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Start by verifying your phone number
          </motion.p>
          {!isOtpSent ? (
            <>
              <motion.div
                className="mt-8 flex items-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    if (e.target.value.match(/^[0-9]*$/))
                      setPhoneNumber(e.target.value);
                  }}
                  className="border w-[350px] h-[45px] border-btnblue rounded-full px-4 py-2"
                />
              </motion.div>
              <motion.div
                className="mt-7 flex items-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button
                  className="apple-button"
                  onClick={handleSendOtp}
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send OTP"}
                </button>
                <a
                  href="/analyze"
                  className="text-sm font-semibold leading-6 text-foreground"
                >
                  Analyze your hairs <span aria-hidden="true">→</span>
                </a>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className="mt-7 flex items-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={otp}
                  onChange={(e) => {
                    if (e.target.value.match(/^[0-9]*$/))
                      setOtp(e.target.value);
                  }}
                  maxLength={4}
                  className="border w-[350px] h-[45px] border-btnblue rounded-full px-4 py-2"
                />
              </motion.div>
              <p className="text-sm text-muted-foreground mt-2.5 ml-2">
                Didn't receive a code?{" "}
                <button
                  className={`text-primary underline cursor-${
                    resendTimer > 0 ? "not-allowed" : "pointer"
                  }`}
                  onClick={() => handleSendOtp()}
                  disabled={isPending || resendTimer > 0}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                </button>
              </p>
              <motion.div
                className="mt-8 flex items-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <button
                  className="apple-button"
                  onClick={handleVerifyOtp}
                  disabled={isPending}
                >
                  {isPending ? "Verifying..." : "Verify OTP"}
                </button>
                <a
                  href="/analyze"
                  className="text-sm font-semibold leading-6 text-foreground"
                >
                  Analyze your hairs <span aria-hidden="true">→</span>
                </a>
              </motion.div>
            </>
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
              src="/appointment/1.png"
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
