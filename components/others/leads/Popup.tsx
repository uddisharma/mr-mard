"use client";

import { useState, useEffect } from "react";
import { SubscriptionForm } from "./Form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

export default function SubscriptionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasClosedPopup = localStorage.getItem("popupClosed") === "true";
    if (!hasClosedPopup) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("popupClosed", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-[740px] w-[90%]  border-0 p-0 bg-btnblue rounded-[10px]">
        <div className="relative p-8 md:p-12 mx-2">
          {/* Content */}
          <div className="space-y-8">
            {/* Title */}
            {/* <h1 className="text-yellow text-4xl md:text-5xl text-center font-serif">
              Mr. Mard
            </h1> */}
            <Image
              src="/logo2.png"
              alt="Milele Health"
              className="m-auto"
              width={150}
              height={100}
            />

            {/* Main Heading */}
            <div className="text-center space-y-2">
              <h2 className="text-white text-2xl md:text-5xl font-medium leading-tight">
                Stay in touch for
              </h2>
              <p className="text-yellow text-2xl md:text-5xl font-medium leading-tight">
                surprise offers!!
              </p>
            </div>

            {/* Privacy Notice */}
            <p className="text-white/90 text-center text-sm md:text-base">
              By submitting, you're agreeing to our{" "}
              <a href="/privacy-policy" className="underline hover:text-yellow">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms-conditions"
                className="underline hover:text-yellow"
              >
                Terms of Services
              </a>
            </p>

            <SubscriptionForm setIsOpen={setIsOpen} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
