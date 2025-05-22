import Image from "next/image";
import { Button } from "../ui/button";

interface pageProps {
  heading: string;
  data: {
    image: string;
    heading: string;
    listData: string[];
  }[];
  data2: {
    image: string;
    heading: string;
    listData: string[];
  }[];
}

export default function MealPlan1(data: pageProps) {
  return (
    <div className="p-5 w-full bg-btnblue flex items-center justify-center rounded-[71px]">
      <div className="w-full max-w-6xl bg-white dark:bg-dot-black/[0.2] bg-dot-white/[0.2] rounded-[144px] p-8 relative">
        <h1 className="text-2xl font-semibold text-center mb-12">
          For Vegetarians
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-8 relative z-10 pb-10">
          {data?.data?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-[350px] m-auto"
            >
              <div className="w-[200px] h-[200px] rounded-full overflow-hidden mb-4">
                <Image
                  src={item?.image}
                  alt={item?.heading}
                  width={192}
                  height={192}
                  className="w-[200px] h-[200px] object-cover"
                />
              </div>

              <h2 className="text-xl font-semibold mb-2 text-left w-full">
                {item?.heading}
              </h2>

              <ul
                style={{ listStyleType: "disc" }}
                className="text-gray-700 text-left pl-5"
              >
                {item?.listData?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 relative">
          <div className="absolute m-auto top-[30%] left-1/2 transform -translate-x-1/2 z-20 max-w-full px-4 sm:px-8">
            <Button
              variant="default"
              className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[6px_30px] text-[14px] rounded-[11px] w-full sm:w-auto hidden sm:block"
            >
              View advanced hair care products with Milele Health
            </Button>
            <Button
              variant="default"
              className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[6px_30px] text-[14px] rounded-[11px] w-full sm:w-auto block sm:hidden h-full py-3"
            >
              Available with paid version
            </Button>
          </div>

          <div className="blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-8 relative z-10 pb-10">
              {data?.data2.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center max-w-[350px] m-auto"
                >
                  <div className="w-[200px] h-[200px] rounded-full overflow-hidden mb-4">
                    <Image
                      src={item?.image}
                      alt={item?.heading}
                      width={192}
                      height={192}
                      className="w-[200px] h-[200px] object-cover"
                    />
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-left w-full">
                    {item?.heading}
                  </h2>

                  <ul
                    style={{ listStyleType: "disc" }}
                    className="text-gray-700 text-left pl-5"
                  >
                    {item?.listData?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
