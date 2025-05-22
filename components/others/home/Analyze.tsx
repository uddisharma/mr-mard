"use client";

import * as React from "react";
// import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Analyze() {
  // const [activeIndex, setActiveIndex] = React.useState(0);

  // const buttons = ["Lorem", "Lorem"];

  return (
    <div className="md:hidden bg-[#eaeaea] rounded-[48px] my-10 py-16">
      <h2 className="text-4xl text-center text-btnblue mb-10">
        Analyse Deeply
      </h2>

      {/* <div className="flex justify-center gap-3">
        {buttons.map((text, index) => (
          <Button
            key={index}
            variant={activeIndex === index ? "default" : "outline"}
            className={`
                                min-w-[120px] min-h-[40px] rounded-full transition-all
                                 ${
                                   activeIndex === index
                                     ? "bg-btnblue text-white hover:bg-btnblue/90"
                                     : "text-btnblue border-[#1B2A4A]"
                                 }`}
            onClick={() => setActiveIndex(index)}
          >
            {text}
          </Button>
        ))}
      </div> */}

      <Image
        src="/appointment-booking.png"
        alt="progress"
        width={500}
        height={500}
        className="px-10 m-auto mt-10"
      />
      <Image
        src="/analyze2.png"
        alt="progress"
        width={500}
        height={500}
        className="px-10 m-auto mt-10"
      />
    </div>
  );
}
