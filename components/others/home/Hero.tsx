"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
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

  const images = [
    "/users/1.png",
    "/users/2.png",
    "/users/3.png",
    "/users/4.png",
  ];

  return (
    <div className="bg-white pb-8">
      <div
        className="hidden relative md:flex justify-between bg-[#EDDE79]  rounded-[0px_0px_144px_144px] px-10 min-h-[650px]"
        style={{
          backgroundImage: 'url("/men.png")',
          backgroundSize: "580px 630px",
          backgroundPosition: "65% bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col space-y-8">
          <h1 className="text-[45px] text-btnblue text-left xs:text-center">
            NO MORE{" "}
            <span className="text-btnblue font-bold">TRAIL AND ERROR</span>{" "}
            <br />
          </h1>
          <p className="text-[18px] text-black max-w-lg pr-10">
            It’s time to find the solution you can finally trust because you
            deserve results. Never let Hair loss take your confidence
          </p>
          <div className="flex flex-col space-y-7 w-[250px] max-w-[250px]">
            <Link href="/analyze">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 1.001 }}
                style={{
                  boxShadow: "0px -10px 20px rgba(26, 47, 78, 0.75)",
                }}
                className={`bg-gradient-to-t to-[#EDDE79] from-[#1b1139] p-[2px] font-semibold text-white rounded-[12px] animate-wiggle ${isShaking ? "animate-shake" : ""}`}
              >
                <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-[12px] border border-[#1b1139] bg-[linear-gradient(110deg,#0f0f1a,45%,#3a3f56,55%,#0f0f1a)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full ">
                  Get Your Hair Analysis
                </button>
              </motion.div>
            </Link>
            {/* <Link href="/about-us">
              <button className="px-14 py-[10px] w-[245px] text-[#1b1139] bg-yellow border-black border-[1.5px] rounded-[12px]  hover:opacity-90 font-normal">
                Learn More
              </button>
            </Link> */}
            <Link
              className="min-w-[280px] flex justify-center items-center gap-1 m-auto text-gray-700"
              href="/technology"
            >
              <div className="flex -space-x-2 items-center text-[15px]">
                {images?.map((i) => (
                  <div
                    key={i}
                    className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                  >
                    <Image
                      src={i}
                      alt={`Customer ${i}`}
                      width={320}
                      height={320}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              Trusted by 1000+ customers
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative mt-28 hidden md:block">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-lg">Hair Density</p>
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-20 bg-black"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <p className="text-lg">Scalp Analysis</p>
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-20 bg-black"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <p className="text-lg">Get Treated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:hidden flex-col space-y-8 bg-yellow px-5 pt-10 rounded-[0px_0px_48px_48px] overflow-hidden">
        <h1 className="text-[40px] md:text-[45px] w-full text-btnblue text-center">
          NO MORE{" "}
          <span className="text-btnblue font-bold">TRAIL AND ERROR</span> <br />{" "}
        </h1>
        <p className="text-[16px] text-black w-full text-center ">
          Get tailored hair care treatments based on advanced hair and scalp
          analysis.
        </p>
        <div className="flex flex-col justify-center items-center space-y-8 w-full pb-5">
          <Link href="/analyze">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1.001 }}
              style={{
                boxShadow: "0px -10px 20px rgba(26, 47, 78, 0.75)",
              }}
              className={`bg-gradient-to-t to-[#EDDE79] from-[#1b1139] p-[2px] font-semibold text-white rounded-[12px] animate-wiggle ${isShaking ? "animate-shake" : ""}`}
            >
              <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-[12px] border border-[#1b1139] bg-[linear-gradient(110deg,#0f0f1a,45%,#3a3f56,55%,#0f0f1a)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full ">
                Get Your Hair Analysis
              </button>
            </motion.div>
          </Link>
        </div>
        <div className="bg-white rounded-[30px] overflow-hidden mx-2 mt-5">
          <Image
            src="/men.png"
            alt=""
            width={400}
            height={400}
            className="object-cover w-full h-full border-[5px] border-[#bea500] rounded-[30px]"
          />
        </div>
        <div className="h-[1px] w-full"></div>
      </div>
    </div>
  );
};

export default Hero;
