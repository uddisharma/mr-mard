import { Card } from "@/components/ui/card";
import HairHealthDashboard from "./components/dashboard";
import { HardDriveIcon } from "lucide-react";
import { BellCurveChart } from "./components/bell-curve-chart";

export default function Home() {
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
  return (
    <>
      {/* <HairHealthDashboard /> */}
      <main className="container max-w-screen-lg mx-auto m-auto bg-[#D5D5D5]">
        <div className="min-h-screen p-4">
          <div className="grid grid-cols-10 gap-4 h-full">
            {/* Sidebar */}
            {/* <div className="col-span-3 space-y-5  rounded-2xl p-4">
              <div className="p-6 bg-white rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Your Hair Score
                </h3>
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="10"
                        strokeDasharray="141.3"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-140 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#818cf8"
                        strokeWidth="10"
                        strokeDasharray="141.3"
                        strokeDashoffset={`${141.3 - (141.3 * enhancedData.overall_score) / 100}`}
                        strokeLinecap="round"
                        transform="rotate(-100 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
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

                      <text
                        x="15"
                        y="95"
                        textAnchor="middle"
                        fontSize="8"
                        fill="#94a3b8"
                      >
                        00
                      </text>
                      <text
                        x="85"
                        y="95"
                        textAnchor="middle"
                        fontSize="8"
                        fill="#94a3b8"
                      >
                        100
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 shadow-sm rounded-3xl bg-gray-50">
                <div className="space-y-4">
                  {Object.entries(enhancedData.metrics).map(([name, value]) => (
                    <div key={name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{name}</span>
                        <span className="text-gray-500">{value}/100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative w-full h-2 bg-yellow rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-btnblue rounded-full"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Main Content Area */}
            <div className="col-span-7 grid grid-cols-2 gap-4 rounded-2xl p-4">
              {/* <div className="bg-white rounded-2xl p-4 h-44 text-black flex justify-center items-center">
                <div className="py-8 shadow-sm text-left">
                  <h3 className="text-lg font-semibold px-6 mb-6 mr-16">
                    Total Hair Count
                  </h3>
                  <div  className="flex justify-center items-center h-full m-auto">
                    <div className="text-5xl font-bold text-[#1e3a5f]">
                      {enhancedData.estimated_hair_count?.toLocaleString() || "95,675"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 h-44 text-black flex justify-center items-center">
                <div className="py-10 shadow-sm text-center">
                  <h3 className="text-lg font-semibold px-6 mb-6 ">
                    Total Hair Type
                  </h3>
                  <div className="flex justify-center gap-5 items-center bg-gray-200 p-2 rounded-2xl h-full">
                    {["Straight", "Wavy", "Curly"].map((type) => (
                      <div
                        key={type}
                        className="text-5xl font-bold text-[#1e3a5f]"
                      >
                        <div className="text-5xl font-bold bg-white border-[2px] border-black text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <HardDriveIcon className="w-4 h-4 text-btnblue" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
              <div className="rounded-2xl p-4 h-44 text-btnblue">
                <Card className="p-6 shadow-sm">
                  <BellCurveChart
                    value={91}
                    average={100}
                    label="91K"
                    color="red"
                  />
                </Card>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 h-40 text-btnblue">
                Card 4
              </div>
              <div className="col-span-2 bg-gray-800 rounded-2xl p-4 h-40 text-btnblue">
                Full Width Card
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
