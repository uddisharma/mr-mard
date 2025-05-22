"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HeroButtons = () => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const shakeButton = () => {
      setIsShaking(true);
      const shakeTimeout = setTimeout(() => {
        setIsShaking(false);
      }, 2000);

      const pauseTimeout = setTimeout(() => {
        shakeButton();
      }, 8000);

      return () => {
        clearTimeout(shakeTimeout);
        clearTimeout(pauseTimeout);
      };
    };

    shakeButton();
  }, []);

  return (
    <div className="flex gap-5">
      <Link href="/appointment-booking">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 1.001 }}
          style={{
            boxShadow: "0px -10px 20px rgba(26, 47, 78, 0.75)",
          }}
          className={`bg-gradient-to-t to-[#EDDE79] from-[#1b1139] p-[2px] font-semibold text-white rounded-[12px] animate-wiggle ${isShaking ? "animate-shake" : ""}`}
        >
          <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-[12px] border border-[#1b1139] bg-[linear-gradient(110deg,#0f0f1a,45%,#3a3f56,55%,#0f0f1a)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full ">
            Book Consultation
          </button>
        </motion.div>
      </Link>
      {/* <Link href="/appointment-booking">
        <div className={`text-white rounded-[12px]`}>
          <button className="inline-flex h-12 items-center justify-center rounded-[12px] px-6 font-medium text-black w-full bg-transparent border-black border-[2px]">
            Try AI Hair Analysis
          </button>
        </div>
      </Link> */}
    </div>
  );
};

export default HeroButtons;
