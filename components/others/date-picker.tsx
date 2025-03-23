"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Stepper2 } from "./step-indicator";

export default function DatePicker({ id }: { id?: string | undefined | null }) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(id ?? null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/appointment-booking");
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  const handleContinue = async () => {
    if (!date) {
      toast.warning("Please select a date to continue");
      return;
    }

    if (!userId) {
      toast.error("Authentication Error");
      router.push("/appointment-booking");
      return;
    }

    setIsLoading(true);

    try {
      await fetch("/api/user-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          lastStep: "TIME_SELECTION",
          selectedDate: date.toISOString(),
        }),
      });
      sessionStorage.setItem("selectedDate", date.toISOString());
      router.push("/appointment-booking/time");
    } catch (error) {
      toast.error("Failed to save your selection");
    } finally {
      setIsLoading(false);
    }
  };

  const disabledDays = { before: new Date() };

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
          <Stepper2 />
          <motion.h1
            className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ lineHeight: "1.1" }} className="text-gradient ">
              Choose a Specific Date
            </span>
          </motion.h1>
          <motion.p
            className="mt-5 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Select a date for your appointment
          </motion.p>

          <motion.div
            className="mt-7 flex items-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              // disabled={disabledDays}
              className="rounded-md border mx-auto w-fit border-none"
            />
          </motion.div>

          <motion.div
            className="mt-8 flex items-center justify-between gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              className="text-sm font-semibold leading-6 text-foreground flex items-center gap-1"
              onClick={() => router.push("/appointment-booking")}
            >
              <span aria-hidden="true">
                <ArrowLeft className="w-4 h-4" />
              </span>
              Back
            </button>
            <button
              style={!date || isLoading ? { cursor: "not-allowed" } : undefined}
              className={`apple-button `}
              onClick={handleContinue}
              disabled={!date || isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
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
