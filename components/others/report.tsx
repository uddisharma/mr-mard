import Score from "./Score";
import Image from "next/image";
import Link from "next/link";
import HairBellCurve from "./Chart";

type DensityClass = "low" | "medium" | "high";

export default function Report({
  enhancedData,
  summary,
  className = "px-16",
}: {
  enhancedData: any;
  summary: Record<DensityClass, string>;
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
                  <div className="text-5xl font-bold text-[#1e3a5f]">
                    <div className="text-5xl font-bold bg-white border-[2px] border-black text-white rounded-full w-9 h-9 flex items-center justify-center">
                      <Image
                        src={`/hair-types/type/${enhancedData?.hair_type?.toLowerCase()}.png`}
                        alt={`${enhancedData?.hair_type} hair density`}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-5xl font-bold text-[#1e3a5f]">
                    <div className="text-5xl font-bold bg-white border-[2px] border-black text-white rounded-full w-9 h-9 flex items-center justify-center">
                      <Image
                        src={`/hair-types/condition/${enhancedData?.hair_condition?.toLowerCase()}.png`}
                        alt={`${enhancedData?.hair_condition} hair density`}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <div className="text-5xl font-bold text-[#1e3a5f]">
                    <div className="text-5xl font-bold bg-white border-[2px] border-black text-white rounded-full w-9 h-9 flex items-center justify-center">
                      <Image
                        src={`/hair-types/density/${enhancedData?.density_class?.toLowerCase()}.png`}
                        alt={`${enhancedData?.density_class} hair density`}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-evenly px-5 ml-[-7px] items-center mt-1">
                  <p className="text-sm text-black">
                    {enhancedData?.hair_type}
                  </p>
                  <p className="text-sm text-black">
                    {enhancedData?.hair_condition}
                  </p>
                  <p className="text-sm text-black">
                    {enhancedData?.density_class}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl h-48 text-btnblue overflow-hidden">
              <HairBellCurve
                data={{
                  estimated_hair_count: enhancedData.estimated_hair_count,
                  expected_range: enhancedData.expected_range,
                  age: 35,
                }}
              />
            </div>
            <div className="rounded-2xl h-48 text-btnblue overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center bg-white"></div>
            </div>
            <div className="col-span-2 rounded-2xl bg-white  text-btnblue overflow-hidden">
              <div className="flex items-center justify-center gap-6 p-6">
                <Image
                  src={`/hair-types/density/${enhancedData?.density_class.toLowerCase()}.png`}
                  alt={`${enhancedData?.density_class} hair density`}
                  width={100}
                  height={50}
                  className="h-full object-contain rounded-xl"
                />
                <p
                  className="text-left max-w-2xl"
                  dangerouslySetInnerHTML={{
                    __html:
                      summary[
                        enhancedData?.density_class?.toLowerCase() as DensityClass
                      ],
                  }}
                />
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
