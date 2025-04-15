"use client";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";

const data = [
  {
    title: "Get Accurate Diagnosis",
    content: "Get right diagnosis that doesn’t need any second opinions",
  },
  {
    title: "Treatment Plans made for ‘You’",
    content: "we believe you are unique and so is our treatment plan",
  },
  {
    title: "Build a habit",
    content:
      "get the right guidance from our hair coach to reach your hair goals",
  },
];

const Cta = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < data.length - 1 ? prevIndex + 1 : 0,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : data.length - 1,
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:mb-12">
      <div className="hidden md:flex items-center justify-center w-full my-10">
        <div className="relative flex items-center w-[80%]">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2"></div>
          <div className="relative flex justify-between w-full">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="relative  flex-col items-center md:grid md:grid-cols-3 md:gap-6 md:pt-6 hidden">
        {data?.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="h-16 w-[2px] bg-black md:hidden" />}
            <Card className="relative flex flex-col items-center text-center bg-btnblue text-white p-6 rounded-lg w-full md:h-[200px]">
              {index == 2 && (
                <img
                  src="/coming-soon1.png"
                  alt="Coming Soon"
                  className="absolute top-[-25px] right-0 w-28 h-auto"
                />
              )}
              <h3 className="text-2xl pt-4">{step.title}</h3>
              <p className="text-lg md:text-sm m-4 text-gray-300">
                {step.content}
              </p>
            </Card>
          </React.Fragment>
        ))}
      </div>

      <div className="relative flex items-center mb-14 mt-5 md:hidden">
        <button
          onClick={handlePrev}
          className="absolute left-1 z-10  p-2 rounded-full shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {data?.map((step, index) => (
              <Card
                key={index}
                className="flex-shrink-0 w-full text-center bg-btnblue text-white p-3 rounded-2xl"
              >
                {index === 2 && (
                  <img
                    src="/coming-soon1.png"
                    alt="Coming Soon"
                    className="absolute top-[-25px] right-0 w-28 h-auto"
                  />
                )}
                <h3 className="text-2xl pt-4">{step.title}</h3>
                <p className="text-lg md:text-sm m-4 text-gray-300">
                  {step.content}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-1 z-10 p-2 rounded-full shadow-md"
        >
          <ChevronLeft className="w-6 h-6 rotate-180 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Cta;
