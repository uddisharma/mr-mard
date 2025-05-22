import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Work = () => {
  return (
    <>
      <div className="px-6 pt-16 pb-5 mt-5 md:hidden rounded-[48px] bg-yellow">
        <div className="min-h-20 w-full flex justify-center items-center">
          <h2 className="text-4xl text-center text-btnblue mb-5">
            How It Works
            <p className="text-center text-black max-w-3xl mx-auto text-lg mt-12">
              Get tailored hair care treatments based on advanced hair and scalp
              analysis. Get tailored hair care treatments based on advanced hair
              and scalp analysis.Get tailored hair care treatments based on
              advanced hair and scalp analysis.
            </p>
          </h2>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <Link href={`/appointment-booking`}>
            <Button
              variant="default"
              className="bg-[#1a2255] text-white p-[6px_30px] text-[14px] rounded-[11px] py-[25px]"
            >
              Get Analysis
            </Button>
          </Link>
        </div>
        <section className="flex flex-col items-center justify-center mx-2 p-6 px-5 rounded-[38px] py-12">
          <div className="max-w-sm w-full space-y-6">
            {[
              "Expert Guidance",
              "AI-Driven Insights",
              "Tailored Solutions",
            ].map((title, index) => (
              <div
                key={index}
                className="bg-btnblue text-center p-6 rounded-[38px] shadow-md border-[1px] border-black py-12 px-10"
              >
                <h3 className="text-[18px] text-white font-semibold">
                  {title}
                </h3>
                <p className="text-white mt-4">
                  Precision diagnostics for hair health.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="hidden md:block ">
        <div className="min-h-16 bg-white w-full flex justify-center items-center"></div>
        <div className="bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2] py-14 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-0 bg-btnblue rounded-[144px] min-h-[400px]  m-auto">
            <div className="rounded-[134px_0px_100px_0px] w-full bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2]">
              <div className="flex justify-center items-center h-full">
                <div className="px-8 py-5 max-w-[800px] w-full">
                  <h1 className="text-[35px] text-left text-btnblue">
                    How we work ?
                  </h1>
                  <p className="text-left text-black">
                    Get tailored hair care treatments based on advanced hair and
                    scalp analysis. Get tailored hair care treatments based on
                    advanced hair and scalp analysis.Get tailored hair care
                    treatments based on advanced hair and scalp analysis.
                  </p>
                  <div className=" mt-4">
                    <Link href={`/appointment-booking`}>
                      <Button
                        variant="default"
                        className="bg-btnblue text-white p-[6px_30px] text-[14px] rounded-[11px] py-[20px]"
                      >
                        Get Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2] relative">
              <div className=" rounded-[100px_144px_0px_0px] bg-btnblue w-full h-full z-10">
                <div className="flex justify-center align-middle items-center h-full pt-5">
                  <div className="bg-yellow text-center p-6 rounded-[38px] shadow-md border-[1px] border-black py-12 px-10">
                    <h3 className="text-[18px] text-btnblue font-semibold">
                      Expert Guidance
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Precision diagnostics for hair health.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2] relative">
              <div className="rounded-[144px_0px_0px_184px] py-10 bg-btnblue z-10 w-full h-full">
                <div className="flex justify-center align-middle items-center h-full py-5">
                  <div className="bg-yellow text-center p-6 rounded-[38px] shadow-md border-[1px] border-black py-12 px-10">
                    <h3 className="text-[18px] text-btnblue font-semibold">
                      AI-Driven Insights
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Precision diagnostics for hair health.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-center align-middle items-center h-full py-5">
                <div className="bg-yellow text-center p-6 rounded-[38px] shadow-md border-[1px] border-black py-12 px-10 my-10">
                  <h3 className="text-[18px] text-btnblue font-semibold">
                    Tailored Solutions
                  </h3>
                  <p className="text-gray-700 mt-2">
                    Precision diagnostics for hair health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Work;
