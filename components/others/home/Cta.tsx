import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const data = [
  {
    title: "Angle Hair Analysis",
    content: "Understand your current scalp condition.",
  },
  {
    title: "Personalized Hair-health Report",
    content: "Get personalized report which was designed by doctors",
  },
  {
    title: "Effective Treatment",
    content:
      "Get treated prescribed by our expert and achieve noticeable improvements in less time.",
  },
];

const images = ["/users/4.png", "/users/5.png", "/users/6.png", "/users/7.png"];

const Cta = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:mb-12">
      {/* Top buttons */}
      <div className="pt-10 pb-5 bg-white">
        <div className=" flex-wrap justify-center gap-4 mb-10 hidden md:flex">
          <Link href={`/analyze`}>
            <Button className="bg-btnblue text-white hover:bg-btnblue/80 rounded-[10px] py-5">
              Get Your Hair Analysis
            </Button>
          </Link>
          <Link href={`/appointment-booking`}>
            <Button variant="outline" className="py-5 gap-2 rounded-[10px]">
              Book your Appointment
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex flex-col items-center justify-center text-center  relative py-2 md:pb-10 ">
          {/* Customer count */}
          <div className="flex gap-3 z-10">
            <h2 className="text-4xl font-bold text-black">
              2200<span className="text-[#000]">+</span>
            </h2>
            <p className="text-lg text-black mt-2">Happy Customers</p>
          </div>
          <div className="flex -space-x-2 my-5">
            {images?.map((i) => (
              <div
                key={i}
                className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden"
              >
                <Image
                  src={i}
                  alt={`Customer ${i}`}
                  width={320}
                  height={320}
                  className="object-cover h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customer count and avatars */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
          <div className="text-3xl font-bold">2200+</div>
          <div className="flex flex-col sm:flex-row items-center">
            <span className="text-black text-[12px] max-w-[80px]">
              Happy Customers
            </span>
            <div className="flex -space-x-2">
              {images?.map((i) => (
                <div
                  key={i}
                  className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden"
                >
                  <Image
                    src={i}
                    alt={`Customer ${i}`}
                    width={64}
                    height={64}
                    className="object-cover rounded-full h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center w-full my-10">
        <div className="relative flex items-center w-[80%]">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2"></div>

          {/* Dots */}
          <div className="relative flex justify-between w-full">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Timeline - Vertical for mobile, horizontal for larger screens */}
      <div className="relative  flex-col items-center md:grid md:grid-cols-3 md:gap-6 md:pt-6 hidden">
        {data?.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="h-16 w-[2px] bg-black md:hidden" />}
            <Card className="relative flex flex-col items-center text-center bg-btnblue text-white p-6 rounded-lg w-full md:h-[200px]">
              {index == 2 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-b-xl">
                  COMING SOON
                </div>
              )}
              <h3 className="text-2xl pt-4">{step.title}</h3>
              <p className="text-lg md:text-sm m-4 text-gray-300">
                {step.content}
              </p>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Cta;
