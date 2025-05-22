"use client";

import type React from "react";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EmailVerification, VerifyEmail } from "@/actions/email-verification";
import { regularRegister } from "@/actions/register";
import { decryptPhoneNumber } from "@/lib/encryption";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [isPending1, startTransition1] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  const [verification, setVerification] = useState({
    isOtpSent: false,
    isVerified: false,
    resendTimer: 0,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    gender: "",
    day: "",
    month: "",
    year: "",
  });
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (verification.resendTimer > 0) {
      const timer = setTimeout(() => {
        setVerification((prev) => ({
          ...prev,
          resendTimer: prev.resendTimer - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [verification.resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = (isResend = false) => {
    if (!formData.email) {
      return toast.error("Email is required");
    }
    const decryptPhone = searchParams.get("token") ?? "";
    const phone = decryptPhoneNumber(decryptPhone) ?? "";

    startTransition(async () => {
      const res = await EmailVerification(phone, formData.email, isResend);
      if (res?.success === false) {
        toast.error(res?.message);
      } else {
        toast.success(res?.message);
        setVerification({
          ...verification,
          isOtpSent: true,
          isVerified: false,
          resendTimer: 30,
        });
        setIsResendDisabled(true);
      }
    });
  };

  const handleVerifyOtp = () => {
    if (!formData.otp) {
      return toast.error("OTP is required");
    }
    startTransition1(async () => {
      const res = await VerifyEmail(formData.email, formData.otp);
      if (res?.success === false) {
        toast.error(res?.message);
      } else {
        toast.success(res?.message);
        setVerification({ ...verification, isVerified: true });
      }
    });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    const userAgent = window.navigator.userAgent.toLowerCase();
    let deviceType = "Phone";
    if (/mobile/i.test(userAgent)) {
      deviceType = "Phone";
    } else if (/tablet/i.test(userAgent)) {
      deviceType = "Tablet";
    } else {
      deviceType = "Desktop";
    }

    startTransition2(async () => {
      const res = await regularRegister({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        gender: formData.gender,
        dob: `${formData.year}-${formData.month}-${formData.day}`,
        phone: decryptPhoneNumber(searchParams.get("token") ?? "") ?? "",
        deviceType,
      });
      if (res?.success) {
        toast.success(res.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          otp: "",
          gender: "",
          day: "",
          month: "",
          year: "",
        });
        router.push(
          `${searchParams?.get("redirect") ? `&redirect=${searchParams.get("redirect")} ` : "/appointment-booking"}`,
        );
      } else {
        toast.error(res?.message);
      }
    });
  };
  return (
    <div className="grid min-h-screen space-y-5 text-black lg:grid-cols-2 bg-white gap-10 px-5 md:px-12 pb-10 p-5 md:p-10">
      <div>
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border-btnblue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-btnblue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className="border-btnblue"
                required
              />
              <div className="flex justify-end pt-3">
                <Button
                  className="bg-btnblue hover:bg-btnblue/90 text-white"
                  onClick={() => handleSendOtp(false)}
                  disabled={verification.isOtpSent || isPending}
                >
                  Send Code
                </Button>
              </div>
            </div>

            {verification.isOtpSent && (
              <div className="space-y-2 pb-4">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  placeholder="Enter the code"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="border-btnblue"
                  required
                />
                <div className="flex justify-between items-center pt-3">
                  <Button
                    className="bg-gray-200 hover:bg-gray-300 text-black"
                    onClick={() => handleSendOtp(true)}
                    disabled={isResendDisabled || isPending || !formData?.email}
                  >
                    {isResendDisabled
                      ? `Resend in ${verification.resendTimer}s`
                      : "Resend OTP"}
                  </Button>
                  <Button
                    className="bg-btnblue hover:bg-btnblue/90 text-white"
                    onClick={handleVerifyOtp}
                    disabled={verification.isVerified || isPending1}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <div className="flex gap-4">
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, month: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem
                        key={month}
                        value={String(index + 1).padStart(2, "0")}
                      >
                        {" "}
                        {/* Ensures 2-digit format */}
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, day: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem
                        key={day}
                        value={String(day).padStart(2, "0")}
                      >
                        {" "}
                        {/* Ensures 2-digit format */}
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, year: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>What&apos;s your gender? (optional)</Label>
              <RadioGroup
                name="gender"
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                className="flex gap-4 text-[#111]"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="non-binary" />
                  <Label htmlFor="non-binary">Non-binary</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" />
                <Label htmlFor="marketing" className="text-sm">
                  Share my registration data with our content providers for
                  marketing purposes.
                </Label>
              </div>

              <div className="text-sm">
                By creating an account, you agree to the{" "}
                <Link href="/terms-conditions" className="underline">
                  Terms of use
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline">
                  Privacy Policy
                </Link>
                .
              </div>

              <Button
                className={`w-full bg-btnblue hover:bg-btnblue/90 text-white ${
                  !verification.isVerified ? "cursor-not-allowed" : ""
                }`}
                onClick={handleSaveUser}
                disabled={!verification.isVerified}
              >
                {isPending2 ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm text-black">
                Already have an account?{" "}
                <Link href="/login" className="underline text-btnblue">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <Image
          src="/user.png"
          alt="Profile"
          width={600}
          height={700}
          className=""
        />
      </div>
    </div>
  );
}
