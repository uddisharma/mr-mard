"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroButtons from "../HeroButtons";

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
        className="hidden relative md:flex justify-between bg-[#EDDE79]  rounded-[0px_0px_144px_144px] px-10 min-h-[500px]"
        style={{
          backgroundImage: 'url("/2.png")',
          backgroundSize: "550px 505px",
          scale: "1",
          backgroundPosition: "90% bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col space-y-8">
          <h1 className="text-[45px] text-btnblue text-left xs:text-center">
            REGAIN HAIR, <br />
            <span className="text-btnblue font-bold">
              REGAIN CONFIDENCE
            </span>{" "}
          </h1>
          <p className="text-[22px] text-black max-w-xl pr-10 ">
            Let’s have a honest conversation about hair
          </p>
          <p
            style={{ marginTop: "0px" }}
            className="text-[22px] text-black max-w-xl pr-10 inline-flex gap-3 items-center"
          >
            regrowth
            <Image
              src="/hand-down.png"
              alt="arrow"
              width={20}
              height={10}
              className="h-6 w-6"
            />
          </p>
          <div className="space-y-7">
            <HeroButtons />
            <div className="min-w-[280px] flex justify-left items-center gap-3 m-auto text-gray-700 pt-5 pl-7 font-bold text-[20px]">
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
            </div>
          </div>
        </div>

        {/* Right Section */}
        {/* <div className="relative mt-28 hidden md:block">
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
        </div> */}
      </div>

      <div className="flex md:hidden flex-col space-y-5 bg-yellow px-5 pt-10 rounded-[0px_0px_48px_48px] overflow-hidden">
        <h1 className="text-[25px] md:text-[45px] w-full text-btnblue text-left">
          Regain Hair, <br />
          <span className="text-btnblue">
            Regain <span className="font-bold">Confidence</span>{" "}
          </span>{" "}
          <br />{" "}
        </h1>
        <p className="text-[14px] text-gray-700 w-full text-left ">
          Let’s have a honest conversation about
        </p>
        <p
          style={{ marginTop: "2px" }}
          className="text-[14px] text-gray-700 max-w-xl pr-10 inline-flex gap-3 items-left justify-left "
        >
          hair regrowth
          <Image
            src="/hand-down.png"
            alt="arrow"
            width={20}
            height={10}
            className="h-6 w-6"
          />
        </p>
        <div className="flex flex-col justify-left items-left max-w-[200px] space-y-5 w-full">
          <Link href="/appointment-booking">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1.001 }}
              // style={{
              //   boxShadow: "0px -10px 20px rgba(26, 47, 78, 0.75)",
              // }}
              className={`bg-gradient-to-t to-[#EDDE79] from-[#1b1139] p-[2px] font-semibold text-white rounded-[12px] animate-wiggle ${isShaking ? "animate-shake" : ""}`}
            >
              <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-[12px] border border-[#1b1139] bg-[linear-gradient(110deg,#0f0f1a,45%,#3a3f56,55%,#0f0f1a)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full ">
                Book Consultation
              </button>
            </motion.div>
          </Link>
          <div className="min-w-[280px] flex justify-left items-center gap-3 m-auto text-gray-700  text-[12px]">
            <div className="flex -space-x-2 items-center text-[15px]">
              {images?.slice(0, 3)?.map((i) => (
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
          </div>
          {/* <Link href="/analyze">
            <div className={`text-white rounded-[12px]`}>
              <button className="inline-flex h-12 items-center justify-center rounded-[12px] px-6 font-medium text-black w-full bg-transparent border-black border-[2px]">
                Try AI Hair Analysis
              </button>
            </div>
          </Link> */}
        </div>
        <div className="bg-yellow rounded-[30px] overflow-hidden mx-2 mt-15">
          <Image
            src="/2.png"
            alt=""
            width={400}
            height={400}
            className="object-cover w-full h-full "
          />
        </div>
        {/* <div className="h-[1px] w-full"></div> */}
      </div>
    </div>
  );
};

export default Hero;
