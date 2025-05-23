import { HardDriveIcon } from "lucide-react";
import Score from "./Score";
import Image from "next/image";

export default function Report() {
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
    <main className="container w-full mx-auto my-10 bg-[#f2f2f2] rounded-2xl px-16 py-6">
      <div className=" p-4">
        <div className="grid grid-cols-10 gap-6 h-full">
          <div className="col-span-3 space-y-5 bg-white rounded-2xl p-2">
            <div className="p-6  rounded-xl">
              <h3 className="text-lg font-semibold mb-10 text-center">
                Your Hair Score
              </h3>
              <Score />
            </div>
            <div className="p-6 shadow-sm rounded-3xl bg-[#f7f7f7]">
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
          </div>
          <div className="col-span-7 grid grid-cols-2 gap-4 rounded-2xl">
            <div className="bg-white rounded-2xl p-4 h-48 text-black flex justify-center items-center">
              <div className="py-8 text-left">
                <h3 className="text-lg font-semibold px-6 mb-6 mr-20">
                  Total Hair Count
                </h3>
                <div className="flex justify-center items-center h-full m-auto">
                  <div className="text-5xl font-bold text-[#1e3a5f]">
                    {enhancedData.estimated_hair_count?.toLocaleString() ||
                      "95,675"}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 h-48  text-black flex justify-left items-center">
              <div className="py-10 shadow-sm text-left w-full">
                <h3 className="text-lg font-semibold px-6 mb-6 ">
                  Total Hair Type
                </h3>
                <div className="flex justify-evenly gap-5 items-center bg-[#ededed] p-2 rounded-2xl h-full mx-5">
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
            </div>
            <div className="rounded-2xl h-48 text-btnblue">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/graphs/image1.png"
                  alt="Density"
                  className="w-full h-full"
                  width={1000}
                  height={1000}
                />
                <p className="absolute top-5 left-[-29px] w-full flex items-center justify-center text-[#e94335] text-xs font-bold pointer-events-none">
                  41k
                </p>
              </div>
            </div>
            <div className=" rounded-2xl h-48 text-btnblue">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/graphs/image.png"
                  alt="Density"
                  className="w-full h-full"
                  width={1000}
                  height={1000}
                />
                <p className="absolute top-5 left-[45px] w-full flex items-center justify-center text-[#34a853] text-xs font-bold pointer-events-none">
                  41k
                </p>
              </div>
            </div>
            <div className="col-span-2 rounded-2xl bg-white h-64 text-btnblue flex justify-center items-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/graphs/image2.png"
                  alt="Density"
                  className=""
                  width={2000}
                  height={1000}
                />
                <p className="absolute top-[74px] left-[110px] w-full flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                  23423
                </p>
                <p className="absolute top-[121px] left-[133px] w-full flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                  36546
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
