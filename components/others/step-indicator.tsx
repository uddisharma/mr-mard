import { CalendarDays, Clock11, Phone, ScanBarcode } from "lucide-react";
import React from "react";

export const Stepper1 = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full mt-5 mb-10">
      <div className="flex justify-start items-center w-full max-w-4xl gap-4 sm:gap-0">
        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center justify-center font-semibold px-4 py-2 rounded-[20px] bg-yellow text-btnblue whitespace-nowrap">
            <span className="text-btnblue">Phone</span>
            <Phone className="w-4 h-4 ml-2" />
          </div>
          <div className="h-0.5 w-16 sm:w-20 bg-btnblue mx-2"></div>
        </div>

        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue">
            2
          </div>
          <div className="h-0.5 w-16 sm:w-20 bg-btnblue mx-2"></div>
        </div>

        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue">
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export const Stepper2 = () => {
  return (
    <div className="flex items-center justify-center w-full mt-5 mb-10">
      <div className="flex items-center w-full max-w-4xl">
        <div className="hidden md:flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            1
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>
        <div className="flex items-center w-full">
          <div
            className={`flex items-center justify-center font-semibold px-4 py-2 rounded-[20px] bg-yellow text-btnblue whitespace-nowrap`}
          >
            <span className="text-btnblue">Choose Date </span>
            <CalendarDays className="w-4 h-4 ml-2" />
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>

        <div className="flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export const Stepper3 = () => {
  return (
    <div className="flex items-center justify-center w-full mt-5 mb-10">
      <div className="flex items-center w-full max-w-4xl">
        <div className="hidden md:flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            1
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>
        <div className="hidden md:flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            2
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>
        <div className="flex items-center w-full">
          <div
            className={`flex items-center justify-center font-semibold px-4 py-2 rounded-[20px] bg-yellow text-btnblue whitespace-nowrap`}
          >
            <span className="text-btnblue">Choose Time </span>
            <Clock11 className="w-4 h-4 ml-2" />
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>
        <div className="flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            4
          </div>
        </div>
      </div>
    </div>
  );
};

export const Stepper4 = () => {
  return (
    <div className="flex items-center justify-center w-full mt-5 mb-10">
      <div className="flex items-center w-full max-w-4xl">
        <div className="hidden md:flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            1
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>
        <div className="flex items-center w-full">
          <div
            className={`flex items-center justify-center text-white font-semibold w-10 h-10 rounded-full bg-btnblue`}
          >
            2
          </div>
          <div className="h-0.5 w-20 bg-btnblue mx-2"></div>
        </div>

        <div className="flex items-center w-full">
          <div
            className={`flex items-center justify-center font-semibold px-4 py-2 rounded-[20px] bg-yellow text-btnblue whitespace-nowrap`}
          >
            <span className="text-btnblue">Checkout</span>
            <ScanBarcode className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
