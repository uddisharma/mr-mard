"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MessageSquareIcon,
  HeartHandshakeIcon,
  FlaskConicalIcon,
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
      id: "counselling",
      label: "Counselling",
      icon: <HeartHandshakeIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "testing",
      label: "Testing & Diagnostics",
      icon: <FlaskConicalIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "medications",
      label: "Medications",
      icon: <PillIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "lifestyle",
      label: "Lifestyle Recommendations",
      icon: <HeartPulseIcon className="h-4 w-4 mr-2" />,
    },
    {
      id: "wellness",
      label: "Wellness Products",
      icon: <ShoppingBagIcon className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="w-full mt-12 mb-20 md:mb-0">
      {/* Tabs */}
      <div className="flex justify-center gap-2  relative overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-full text-sm md:font-medium transition-colors
                        ${activeTab === tab.id ? "bg-btnblue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:mb-16 mt-12">
        {activeTab === "consultations" && (
          <div className="md:flex grid grid-cols-1 gap-8">
            <div className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 md:w-[65%] w-full">
              <div className="flex items-center gap-4">
                <div className="bg-yellow p-4 rounded-full">
                  <FlaskConicalIcon className="h-5 w-5 text-btnblue " />
                </div>
                <h2 className="text-2xl text-btnblue">Testing & Diagnostics</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-normal text-btnblue">
                    Hormonal Analysis
                  </h3>
                  <p className="text-gray-500">
                    For detecting hormonal sex-issues
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-normal text-btnblue">
                    STI & STD Test Panels
                  </h3>
                  <p className="text-gray-500">
                    Advanced testing for all STIs/STDs
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-normal text-btnblue">
                    Scans & Ultrasounds
                  </h3>
                  <p className="text-gray-500">
                    For detecting physical sex-issues
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-normal text-btnblue">
                    Discreet Report Delivery
                  </h3>
                  <p className="text-gray-500">
                    Instant digital report delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center flex-3 md:w-[35%] w-full">
              <div className="rounded-full overflow-hidden w-80 h-80">
                <Image
                  src="/ai.png"
                  alt="Medical testing procedure"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab !== "testing" && (
          <div className="flex justify-center items-center p-12 text-gray-500">
            <p>
              Content for {tabs.find((t) => t.id === activeTab)?.label} tab
              would appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
