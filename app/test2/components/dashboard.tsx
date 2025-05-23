"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BellCurveChart } from "./bell-curve-chart";
import { HairTrendChart } from "./hair-trent-chart";

// This would normally come from an API or props
const hairData = {
  density: 0.0,
  scaled_density: 0.0,
  coverage: {
    overall: 0.0,
    frontal: 0.0,
    crown: 0.0,
  },
  regional_densities: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  hair_type: "Straight",
  hair_type_confidence: 0.8140454888343811,
  density_class: "High",
  hair_condition: "dry",
  condition_confidence: 0.3780626654624939,
  overall_score: 34.0,
  future_prediction: {},
  estimated_hair_count: null,
  expected_range: null,
};

// For demo purposes, we'll use some dummy values where the API returns null
const enhancedData = {
  ...hairData,
  overall_score: hairData.overall_score || 75,
  estimated_hair_count: hairData.estimated_hair_count || 95675,
  metrics: {
    "Hair Thickness": 80,
    Oiliness: 65,
    "Hair Density": 78,
    "Scalp Coverage": 85,
    Dryness: 70,
    "Hair Type Adjustment": 75,
  },
  hairCount: {
    current: 91000,
    average: 100000,
  },
  hairScore: {
    current: 75,
    average: 70,
  },
  recommendations: [
    "Better hair coverage.",
    "Dryness in top 70%; hydrate more.",
    "Hair density improved; more growth",
    "No dandruff.",
  ],
};

export default function HairHealthDashboard() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="w-full max-w-[1330px] mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-gray-200 overflow-hidden">
          <button
            className={`px-8 py-3 text-sm font-medium ${
              activeTab === "general"
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-gray-700"
            } rounded-full`}
            onClick={() => setActiveTab("general")}
          >
            General Hair Health
          </button>
          <button
            className={`px-8 py-3 text-sm font-medium ${
              activeTab === "loss"
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-gray-700"
            } rounded-full`}
            onClick={() => setActiveTab("loss")}
          >
            Hair Loss Analysis
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Hair Score */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Your Hair Score</h3>
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                    strokeDasharray="236"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-135 50 50)"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="10"
                    strokeDasharray="236"
                    strokeDashoffset={`${236 - (236 * enhancedData.overall_score) / 100}`}
                    strokeLinecap="round"
                    transform="rotate(-135 50 50)"
                  />
                  {/* Text */}
                  <text
                    x="50"
                    y="45"
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    {enhancedData.overall_score}
                  </text>
                  <text
                    x="50"
                    y="60"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                  >
                    /100
                  </text>
                  {/* Min/Max Labels */}
                  <text
                    x="15"
                    y="75"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#94a3b8"
                  >
                    00
                  </text>
                  <text
                    x="85"
                    y="75"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#94a3b8"
                  >
                    100
                  </text>
                </svg>
              </div>
            </div>
          </Card>

          {/* Total Hair Count */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Total Hair Count</h3>
            <div className="flex justify-center items-center h-48">
              <div className="text-6xl font-bold text-[#1e3a5f]">
                {enhancedData.estimated_hair_count?.toLocaleString() ||
                  "95,675"}
              </div>
            </div>
          </Card>

          {/* Hair Type */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Hair Type</h3>
            <div className="flex justify-center items-center h-48">
              <div className="bg-gray-100 rounded-full p-2 flex justify-between w-full max-w-xs">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C12 8 12 16 12 22"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19 12H5"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm mt-2">Straight</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="#666"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#666"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-sm mt-2">Low</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-black"></div>
                  <span className="text-sm mt-2">Black</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bell Curve Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 shadow-sm">
            <BellCurveChart value={91} average={100} label="91K" color="red" />
          </Card>

          <Card className="p-6 shadow-sm">
            <BellCurveChart value={75} average={70} label="75" color="green" />
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics */}
          <Card className="p-6 shadow-sm">
            <div className="space-y-4">
              {Object.entries(enhancedData.metrics).map(([name, value]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{name}</span>
                    <span className="text-gray-500">{value}/100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1e3a5f] to-yellow-400"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trend Chart */}
          <div className="space-y-6">
            <Card className="p-6 shadow-sm">
              <HairTrendChart />
            </Card>

            {/* Recommendations */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <ul className="space-y-2">
                  {enhancedData.recommendations
                    .slice(0, 2)
                    .map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-gray-400">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  {enhancedData.recommendations.slice(2).map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-gray-400">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
