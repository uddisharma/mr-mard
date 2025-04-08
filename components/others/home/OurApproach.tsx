import {
  BeakerIcon,
  ChartNoAxesCombined,
  CircleCheckBig,
  FlaskConical,
  Users,
} from "lucide-react";

export default function OurApproach() {
  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto px-4 md:mb-20 md:mt-20 mb-20 mt-6">
      <div className="bg-gray-100 text-gray-700 px-6 py-2 rounded-full mb-5">
        Our Approach
      </div>

      <h1 className="text-3xl md:text-4xl  text-center text-btnblue mb-8">
        Scientific treatments, that work!
      </h1>

      <p className="text-gray-500 text-center text-[18px] max-w-4xl md:mb-16 mb-8">
        Expert-led and customer friendly approach to tackle hair challenges for
        results that are long lasting
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full ">
        {/* Card 1 */}
        <div
          style={{
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
          className="border border-gray-200 bg-white rounded-xl p-8"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <FlaskConical className="h-5 w-5 text-btnblue" />
            </div>
            <h3 className="text-md font-semibold text-left text-btnblue">
              Transparent & Honest conversation
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">
                Outcome oriented approach to treatment{" "}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Research based assessment methods</p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">
                {" "}
                No Salesy conversation, only your best interest at heart
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
          className="border border-gray-200 bg-white rounded-xl p-8"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <Users className="h-5 w-5 text-teal-500" />
            </div>
            <h3 className="text-md font-semibold text-left text-btnblue">
              Integrated & Holistic
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Consultations & Counselling </p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Personalised Treatment Plans </p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Clinically proven products </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }}
          className="border border-gray-200 bg-white rounded-xl p-8"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-purple-100 p-4 rounded-full">
              <ChartNoAxesCombined className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-md font-semibold text-center text-btnblue">
              Result Oriented
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">Follow ups to keep you on track </p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">24/7 Patient Care Support </p>
            </div>

            <div className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-btnblue mt-0.5 flex-shrink-0" />
              <p className="text-gray-500">
                Dedicated hair coach for quick replies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
