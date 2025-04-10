"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MessageSquareIcon,
  PillIcon,
  HeartPulseIcon,
  ShoppingBagIcon,
} from "lucide-react";

export default function TestingDiagnostics() {
  const [activeTab, setActiveTab] = useState("consultations");

  const tabs = [
    {
      id: "consultations",
      label: "Consultations",
      icon: <MessageSquareIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "medications",
      label: "Medications",
      icon: <PillIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "coaching",
      label: "Coaching",
      icon: <ShoppingBagIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "lifestyle",
      label: "Lifestyle Recommendations",
      icon: <HeartPulseIcon className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="flex flex-col items-center  mx-auto px-4 md:mb-20 md:mt-16 mb-20 mt-6">
      <div className=" bg-btnblue text-white px-6 py-2 rounded-full mb-5">
        360 Degree Coverage
      </div>
      <h2 className="text-3xl md:text-4xl w-full text-center text-btnblue py-6 mb-2">
        Complete Hair Wellness
      </h2>
      <div className="w-full mt-4 mb-20  md:mb-0 rounded-2xl mx-auto px-4 max-w-5xl bg-gray-50 py-10">
        {/* Tabs */}

        <div
          className="flex md:justify-center gap-2 relative overflow-x-auto hide-scrollbar scroll-snap-x px-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm md:font-medium transition-colors scroll-snap-align-start
        ${
          activeTab === tab.id
            ? "bg-btnblue text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
              style={{ scrollSnapAlign: "start" }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 md:mb-5 mt-12">
          {activeTab === "consultations" && (
            <div className="md:flex grid grid-cols-1 gap-8">
              <div
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                }}
                className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 md:w-[65%] w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow p-2 rounded-full font-bold">
                    <Image
                      src="/icons/consultation.png"
                      alt="Medical testing procedure"
                      width={20}
                      height={20}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                  <h2 className="text-2xl text-btnblue"> Consultations</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Detailed Root Cause Assessment
                    </h3>
                    <p className="text-gray-500">
                      360 degree assessment to find root-cause
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Personalised Treatment
                    </h3>
                    <p className="text-gray-500">Personalised for your goals</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Doctor’s care from start to finish
                    </h3>
                    <p className="text-gray-500">
                      Regular follow-ups & progress tracking
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center flex-3 md:w-[35%] w-full">
                <div>
                  <Image
                    src="/appointment/Treatment.png"
                    alt="Medical testing procedure"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "medications" && (
            <div className="md:flex grid grid-cols-1 gap-8">
              <div
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                }}
                className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 md:w-[65%] w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow p-2 rounded-full font-bold">
                    <Image
                      src="/icons/medication.png"
                      alt="Medical testing procedure"
                      width={20}
                      height={20}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                  <h2 className="text-2xl text-btnblue">Medications</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Clinically Approved
                    </h3>
                    <p className="text-gray-500">
                      Safe with guaranteed results
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Safe from harsh chemicals
                    </h3>
                    <p className="text-gray-500">
                      Free from suphates & paraben
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Effective & Proven Results
                    </h3>
                    <p className="text-gray-500">
                      We recommend products that has proven track record
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center flex-3 md:w-[35%] w-full">
                <div>
                  <Image
                    src="/appointment/Medication.png"
                    alt="Medical testing procedure"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "lifestyle" && (
            <div className="md:flex grid grid-cols-1 gap-8">
              <div
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                }}
                className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 md:w-[65%] w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow p-2 rounded-full font-bold">
                    <Image
                      src="/icons/lifestyle.png"
                      alt="Medical testing procedure"
                      width={20}
                      height={20}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                  <h2 className="text-2xl text-btnblue">
                    Lifestyle Recommendations
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Bridging Nutritional Gaps
                    </h3>
                    <p className="text-gray-500">
                      Address nutritional deficiency through diet
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Relieve from stress Stress
                    </h3>
                    <p className="text-gray-500">
                      relieving activities to promote hair growth
                    </p>
                  </div>

                  {/* <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Improve Quality of Sleep
                    </h3>
                    <p className="text-gray-500">For improved hair health</p>
                  </div> */}
                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Reduce environment impact
                    </h3>
                    <p className="text-gray-500">
                      simple swaps to improve surroundings
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center flex-3 md:w-[35%] w-full">
                <div>
                  <Image
                    src="/appointment/Life style changes.png"
                    alt="Medical testing procedure"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "coaching" && (
            <div className="md:flex grid grid-cols-1 gap-8">
              <div
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                }}
                className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 md:w-[65%] w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow p-2 rounded-full font-bold">
                    <Image
                      src="/icons/coaching.png"
                      alt="Medical testing procedure"
                      width={20}
                      height={20}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                  <h2 className="text-2xl text-btnblue">Coaching</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Habit formation
                    </h3>
                    <p className="text-gray-500">
                      We help in forming a routine that you can follow
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Expert guidance
                    </h3>
                    <p className="text-gray-500">
                      we can answer any unanswered question
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-btnblue">
                      Diet enhancement
                    </h3>
                    <p className="text-gray-500">
                      Helps curate your diet and lifestyle as per your need
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center flex-3 md:w-[35%] w-full">
                <div>
                  <Image
                    src="/coaching.png"
                    alt="Medical testing procedure"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain rounded-lg max-h-[350px] min-w-[200px] "
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
