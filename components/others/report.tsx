import { HardDriveIcon } from "lucide-react";
import Score from "./Score";
import Image from "next/image";
import Link from "next/link";
import HairBellCurve from "./Chart";

export default function Report({
  enhancedData,
  className = "px-16",
}: {
  enhancedData: any;
  className?: string;
}) {
  return (
    <main
      className={`container w-full mx-auto my-10 bg-[#f2f2f2] rounded-2xl py-6 ${className}`}
    >
      <div className=" p-4">
        <div className="grid grid-cols-10 gap-6 h-full">
          <div className="col-span-3 space-y-5 bg-white rounded-2xl p-2">
            <div className="p-6  rounded-xl">
              <h3 className="text-lg font-semibold mb-10 text-center">
                Your Hair Score
              </h3>
              <Score score={enhancedData.overall_score} />
            </div>
            <div className="p-6 shadow-sm rounded-3xl bg-[#f7f7f7]">
              <div className="space-y-4">
                {Object.entries(enhancedData.metrics).map(
                  ([name, value]: any) => (
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
                  ),
                )}
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
                <div className="flex justify-evenly gap-5 items-center bg-[#ededed] p-3 rounded-2xl h-full mx-5">
                  {["Medium", "High", "Low"].map((type) => (
                    <div
                      key={type}
                      className="text-5xl font-bold text-[#1e3a5f]"
                    >
                      <div className="text-5xl font-bold bg-white border-[2px] border-black text-white rounded-full w-9 h-9 flex items-center justify-center">
                        <Image
                          src={`/hair-types/density/${type.toLowerCase()}.png`}
                          alt={type}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-evenly items-center mt-1">
                  {["Medium", "High", "Low"].map((type) => (
                    <p key={type} className="text-sm text-black">
                      {type}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl h-48 text-btnblue overflow-hidden">
              {/* <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/graphs/image1.png"
                  alt="Density"
                  className="w-full h-full object-contain"
                  width={1000}
                  height={1000}
                />
                <p className="absolute top-5 left-[-29px] w-full flex items-center justify-center text-[#e94335] text-xs font-bold pointer-events-none">
                  41k
                </p>
              </div> */}
              <HairBellCurve
                data={{
                  estimated_hair_count: enhancedData.estimated_hair_count,
                  expected_range: enhancedData.expected_range,
                  age: 35,
                }}
              />
            </div>
            <div className="rounded-2xl h-48 text-btnblue overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center bg-white">
                {/* <Image
                  src="/graphs/image.png"
                  alt="Density"
                  className="w-full h-full object-contain"
                  width={1000}
                  height={1000}
                />
                <p className="absolute top-5 left-[45px] w-full flex items-center justify-center text-[#34a853] text-xs font-bold pointer-events-none">
                  41k 
                </p> */}
              </div>
            </div>
            <div className="col-span-2 rounded-2xl bg-white h-64 text-btnblue overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/graphs/image2.png"
                  alt="Density"
                  className="w-full h-full object-contain"
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
      <Link href="/appointment-booking?f=report">
        <div className="mx-auto w-max bg-btnblue text-white px-20 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition duration-300 mt-5">
          Book Consultation
        </div>
      </Link>
    </main>
  );
}
