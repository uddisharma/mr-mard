// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Play } from "lucide-react";
// import Image from "next/image";
// import React from "react";

// const Cta = () => {
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 mb-10">
//       {/* Top buttons */}
//       <div className="bg-white py-10 mb-5">
//         <div className="flex flex-wrap justify-center gap-16 mb-12">
//           <Button className="bg-[#1a2642] text-white hover:bg-[#243154] rounded-[12px] py-5">
//             Get Your Hair Analysis
//           </Button>
//           <Button variant="outline" className="py-5 gap-2 rounded-[12px]">
//             <div className="flex items-center gap-2 text-white bg-black rounded-full p-1">
//               <Play size={16} className="" />
//             </div>
//             Watch Demo
//           </Button>
//         </div>
//         {/* Customer count and avatars */}
//         <div className="flex flex-wrap items-center justify-center gap-2 ">
//           <div className="text-3xl font-bold">2200+</div>
//           <div className="flex flex-col sm:flex-row items-center ">
//             <span className="text-black text-[12px] max-w-[80px]">
//               Happy Customers
//             </span>
//             <div className="flex -space-x-2">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
//                 >
//                   <Image
//                     src={`/user.png`}
//                     alt={`Customer ${i}`}
//                     width={32}
//                     height={32}
//                     className="object-cover"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Timeline */}
//       <div className="relative mb-8">
//         <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black -translate-y-1/2" />
//         <div className="relative flex justify-between">
//           {[1, 2, 3].map((step) => (
//             <div key={step} className="w-4 h-4 rounded-full bg-black z-10" />
//           ))}
//         </div>
//       </div>

//       {/* Process steps */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
//         {[
//           { title: "1. Analyze", active: false },
//           { title: "2. Get Report", active: false },
//           { title: "3. Treatment", active: false },
//         ].map((step, index) => (
//           <Card
//             key={index}
//             className={`p-6 ${
//               step.active
//                 ? "bg-btnblue text-white ring-2 ring-blue-400"
//                 : "bg-btnblue text-white"
//             }`}
//           >
//             <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//             <p className="text-sm text-gray-300">
//               Lorem Ipsum is simply dummy text of the printing and typesetting
//               industry.
//             </p>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Cta;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const data = [
  {
    title: "Angle Hair Analysis",
    content: "Understand your current scalp condition.",
  },
  {
    title: "Personalized Hair-health Report",
    content: "Get personalized report which was designed by doctors",
  },
  {
    title: "Effective Treatment",
    content:
      "Get treated prescribed by our expert and achieve noticeable improvements in less time.",
  },
];

const images = ["/users/4.png", "/users/5.png", "/users/6.png", "/users/7.png"];

const Cta = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:mb-12">
      {/* Top buttons */}
      <div className="pt-10 pb-5 bg-white">
        <div className=" flex-wrap justify-center gap-4 mb-10 hidden md:flex">
          <Link href={`/analyze`}>
            <Button className="bg-btnblue text-white hover:bg-btnblue/80 rounded-[10px] py-5">
              Get Your Hair Analysis
            </Button>
          </Link>
          <Button variant="outline" className="py-5 gap-2 rounded-[10px]">
            <div className="flex items-center gap-2 text-white bg-black rounded-full p-1">
              <Play size={16} />
            </div>
            Watch Demo
          </Button>
        </div>

        <div className="md:hidden flex flex-col items-center justify-center text-center  relative py-2 md:pb-10 ">
          {/* Customer count */}
          <div className="flex gap-3 z-10">
            <h2 className="text-4xl font-bold text-black">
              2200<span className="text-[#000]">+</span>
            </h2>
            <p className="text-lg text-black mt-2">Happy Customers</p>
          </div>
          <div className="flex -space-x-2 my-5">
            {images?.map((i) => (
              <div
                key={i}
                className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden"
              >
                <Image
                  src={i}
                  alt={`Customer ${i}`}
                  width={320}
                  height={320}
                  className="object-cover h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Customer count and avatars */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
          <div className="text-3xl font-bold">2200+</div>
          <div className="flex flex-col sm:flex-row items-center">
            <span className="text-black text-[12px] max-w-[80px]">
              Happy Customers
            </span>
            <div className="flex -space-x-2">
              {images?.map((i) => (
                <div
                  key={i}
                  className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden"
                >
                  <Image
                    src={i}
                    alt={`Customer ${i}`}
                    width={64}
                    height={64}
                    className="object-cover rounded-full h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center w-full my-10">
        <div className="relative flex items-center w-[80%]">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black transform -translate-y-1/2"></div>

          {/* Dots */}
          <div className="relative flex justify-between w-full">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Timeline - Vertical for mobile, horizontal for larger screens */}
      <div className="relative  flex-col items-center md:grid md:grid-cols-3 md:gap-6 md:pt-6 hidden">
        {data?.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="h-16 w-[2px] bg-black md:hidden" />}
            <Card className="flex flex-col items-center text-center bg-btnblue text-white p-6 rounded-lgw-full md:h-[200px]">
              <h3 className="text-2xl pt-4 ">{step.title}</h3>
              <p className="text-lg md:text-sm m-4 text-gray-300">
                {step.content}
              </p>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Cta;
