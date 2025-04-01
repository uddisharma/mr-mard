import { BeakerIcon, CircleCheckBig } from "lucide-react";

export default function OurApproach() {
  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto px-4 md:mb-16 mt-20">
      <div className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full  mb-5">
        Our Approach
      </div>

      <h1 className="text-3xl md:text-4xl  text-center text-btnblue mb-8">
        Scientific treatments, that work!
      </h1>

      <p className="text-gray-500 text-center text-[18px] max-w-4xl md:mb-16 mb-8">
        Expert-led and research-driven, our approach tackles sexual health
        challenges for results that truly last.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full ">
        {/* Card 1 */}
        <div className="border border-gray-200 bg-white rounded-xl p-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <BeakerIcon className="h-5 w-5 text-btnblue" />
            </div>
            <h3 className="text-md font-semibold text-center text-btnblue">
              100% Science-backed
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Research backed Asses</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Evidence based diagnosis</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Outcome oriented treatment</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-gray-200 bg-white rounded-xl p-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <BeakerIcon className="h-5 w-5 text-teal-500" />
            </div>
            <h3 className="text-md font-semibold text-center text-btnblue">
              100% Science-backed
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Research backed Asses</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Evidence based diagnosis</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Outcome oriented treatment </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-gray-200 bg-white rounded-xl p-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <BeakerIcon className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-md font-semibold text-center text-btnblue">
              100% Science-backed
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Research backed Assess</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Evidence based diagnosis</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Outcome oriented treatment </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
