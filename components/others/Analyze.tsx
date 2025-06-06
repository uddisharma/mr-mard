"use client";
import MealPlan from "@/components/others/dietPlan";
import MealPlan1 from "@/components/others/dietPlan1";
import FAQ from "@/components/others/faq";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import {
  // dietPlans,
  reportData1,
  reportData2,
  reportData3,
  reportData4,
} from "@/data/report";
import Report from "@/components/others/report";
import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "next-auth";
import Score from "@/components/others/Score";
import { useState } from "react";
import Link from "next/link";
export default function HairAnalysis({ data }: { data: any }) {
  const enhancedData = {
    ...data,
    overall_score: data.overall_score?.toFixed(0) || 75,
    estimated_hair_count: data.estimated_hair_count || 95675,
    metrics: {
      "Hair Thickness": (data?.scaled_density).toFixed(0) || 80,
      Oiliness: (data?.condition_confidence * 100).toFixed(0) || 65,
      "Hair Density": (data?.density).toFixed(0) || 78,
      // "Scalp Coverage": 85,
      // "Dryness": 70,
      // "Hair Type Adjustment": 75,
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
  const user = useCurrentUser();
  return (
    <div className="container mx-auto">
      <MobileVerion user={user} enhancedData={enhancedData} />
      <div className="p-4 rounded-xl">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-center mb-6 md:mb-10">
            <TabsList className="grid w-full max-w-md grid-cols-2 items-center justify-center rounded-[144px]  border-btnblue border-[1px] h-[45px] text-btnblue font-bold">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-[#1B2B4B] data-[state=active]:text-white rounded-[144px] h-[35px] text-xs md:text-sm"
              >
                General Hair Health
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:bg-[#1B2B4B] data-[state=active]:text-white rounded-[144px] h-[35px] text-xs md:text-sm"
              >
                Hair Loss Analysis
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="general">
            <General />
          </TabsContent>
          <TabsContent value="analysis">
            <Analysis />
          </TabsContent>
        </Tabs>
      </div>
      <div className="px-5 ">
        <FAQ />
      </div>
    </div>
  );
}

const MobileVerion = ({
  user,
  enhancedData,
}: {
  user: User | undefined;
  enhancedData: any;
}) => {
  const [showReport, setShowReport] = useState<boolean>(false);
  type DensityClass = "low" | "medium" | "high";

  const summary: Record<DensityClass, string> = {
    low: `<p>
        Your results show the beginning stages of hair loss. The good news is that at this stage, it's highly manageable with the right care.
        <br />
        With guidance from our expert doctors, we can create personalized plan just for you.
      </p>`,

    medium: `<p>
        Your results indicate a moderate level of hair loss, which means now is the perfect time to take action.
        <br />
        At this stage, a proactive approach can make a significant difference.
      </p>`,

    high: `<p>
        Thank you for trusting us with your assessment. Your results indicate an advanced stage of hair loss, which requires specialized care for the most effective treatment.
        <br />
        In the spirit of full transparency, the best next step is an in-clinic consultation with a hair restoration specialist.
      </p>`,
  };
  return (
    <>
      <div className="md:bg-yellow bg-[#f9f3ce] py-5  md:mx-6 px-4 mx-5 rounded-[15px] md:rounded-[144px]  ">
        <p className="text-[#1E2A4A] text-[25px] text-center font-semibold hidden md:block">
          Hair Health Report for {user?.name}
        </p>
        <p className="text-[#1E2A4A] text-[25px] text-center font-semibold md:hidden">
          Hair Health Report
        </p>
      </div>
      <div className="hidden md:block md:mx-24">
        <Report enhancedData={enhancedData} summary={summary} />
      </div>

      <Card className="max-w-2xl bg-[#f9f3ce] md:hidden mx-5 rounded-[15px] mt-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-normal">
            Get quick picks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8 px-4">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                <Image
                  className="h-10 w-10"
                  src={`/hair-types/type/${enhancedData?.hair_type?.toLowerCase()}.png`}
                  alt={`${enhancedData?.hair_type} hair density`}
                  height={10}
                  width={10}
                />
              </div>
              <span className="text-xl">{enhancedData?.hair_type}</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                <Image
                  className="h-10 w-10"
                  src={`/hair-types/condition/${enhancedData?.hair_condition?.toLowerCase()}.png`}
                  alt={`${enhancedData?.hair_condition} hair density`}
                  height={10}
                  width={10}
                />
              </div>
              <span className="text-xl">{enhancedData?.hair_condition}</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                <Image
                  className="h-10 w-10"
                  src={`/hair-types/density/${enhancedData?.density_class?.toLowerCase()}.png`}
                  alt={`${enhancedData?.density_class} hair density`}
                  height={10}
                  width={10}
                />
              </div>
              <span className="text-xl">{enhancedData?.density_class}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative pb-8 mx-5 mt-16 md:hidden">
        <Card className="w-full bg-[#eaecef]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-left">
              Your Hair Score
            </CardTitle>
          </CardHeader>
          <Score score={enhancedData.overall_score} />
        </Card>
        <Button
          onClick={() => setShowReport(!showReport)}
          variant="default"
          className="absolute left-1/2 top-[80%] bottom-0 -translate-x-1/2 rounded-full w-[95px] px-3 h-[95px] bg-btnblue hover:bg-btnblue flex items-center justify-center text-sm"
        >
          {showReport ? "See Less" : "See More"}
        </Button>
      </div>
      {showReport && (
        <div className="p-8 mx-5  rounded-xl bg-[#eaecef]">
          <div className="space-y-4">
            {Object.entries(enhancedData.metrics).map(([name, value]: any) => (
              <div key={name} className="space-y-3">
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
      )}

      <div
        className={`relative pb-5 mx-5  md:hidden ${showReport ? "mt-12" : "mt-16"}`}
      >
        <Card className="w-full bg-white border-[1px] border-black">
          <CardContent className="flex flex-col items-center gap-6 pb-5 my-5">
            <div className="flex items-center flex-col justify-center gap-6 p-6">
              <Image
                src={`/hair-types/density/${enhancedData?.density_class.toLowerCase()}.png`}
                alt={`${enhancedData?.density_class} hair density`}
                width={100}
                height={50}
                className="h-full object-contain rounded-xl"
              />
              <p
                className="text-center max-w-2xl"
                dangerouslySetInnerHTML={{
                  __html:
                    summary[
                      enhancedData?.density_class?.toLowerCase() as DensityClass
                    ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Link href="/appointment-booking?f=report">
        <div className="mx-auto w-max bg-btnblue mb-10 text-white px-20 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition duration-300 mt-5 md:hidden">
          Book Consultation
        </div>
      </Link>
      <div className="md:bg-yellow bg-[#f9f3ce] py-4 md:mx-6 px-4 mx-5 rounded-[15px] md:rounded-[144px] md:hidden mb-3">
        <p className="text-[#1E2A4A] text-[25px] text-center font-semibold">
          Diet Plans
        </p>
      </div>
    </>
  );
};

const General = () => {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        {/* Desktop */}
        <div className="text-center my-10 px-5 pb-12">
          <h1 className="text-2xl font-semibold mb-2">
            Personalised Diet Plan
          </h1>
          <h2 className="text-xl font-normal mb-2">
            Nourish Your Hair from Within
          </h2>
          <p className=" text-btnblue">
            Your hair health is closely linked to your diet. Here’s a customized
            meal plan to provide the nutrients your hair needs:
          </p>
        </div>
        <div className="flex flex-col space-y-10 mt-[-25px]">
          <MealPlan heading="For Vegetarians" data={reportData1} />
          <MealPlan heading="For Non Vegetarians" data={reportData2} />
        </div>
        <div className="text-center my-16 px-5">
          <h1 className="text-2xl font-semibold mb-2">
            Personalised Lifestyle Changes for Healthy Hair
          </h1>
          <h2 className="text-xl font-normal mb-2">Small Habits, Big Impact</h2>
        </div>
        <div className="flex flex-col space-y-10 ">
          <MealPlan heading="For Vegetarians" data={reportData3} />
        </div>
        <div className="text-center my-16 px-5">
          <h1 className="text-2xl font-semibold mb-2">
            Personalised Hair Care Products
          </h1>
          <h2 className="text-xl font-normal mb-2">
            Our AI has curated a list of products suited to your scalp condition
            and hair goals.
          </h2>
        </div>
        <div className="flex flex-col space-y-10 ">
          <MealPlan1
            heading="For Vegetarians"
            data={reportData4}
            data2={reportData4}
          />
        </div>
        <div className="mt-10 flex justify-center">
          <Button
            variant="default"
            className="bg-btnblue text-white hover:bg-btnblue/80 p-[6px_30px] text-[14px] rounded-[11px] py-5"
          >
            Buy Now
          </Button>
        </div>
        <div className="text-left py-12 px-5 md:px-24">
          <h1 className="text-2xl font-semibold mb-2">
            Take the first step Toward Healthier Hairs
          </h1>
          <h2 className="text-sm font-normal mb-2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic cum
            aperiam possimus laborum culpa asperiores, quibusdam eveniet saepe
            rem deleniti vitae, nisi corrupti impedit molestias, neque modi
            tempora enim eligendi.
          </h2>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="w-full max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Veg</h2>
            {/* <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 swiper-button-prev" aria-label="Previous slide">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 swiper-button-next" aria-label="Next slide">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div> */}
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="food-swiper"
          >
            {reportData1?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl overflow-hidden bg-card">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.heading1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#f9f3ce]">
                    <h3 className="font-medium h-[70px] min-h-[70px]">
                      {item.heading1}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Non Veg</h2>
          </div>
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="food-swiper"
          >
            {reportData2.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl overflow-hidden bg-card">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.heading1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#f9f3ce]">
                    <h3 className="font-medium min-h-[50px]">
                      {item.heading1}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-3">
          <h2 className="font-bold text-[25px] px-2 text-center ">
            Personalised Lifestyle Changes for Healthy Hair
          </h2>
          <p className="text-center text-[20px] mt-3">
            Small Habits, Big Impact
          </p>
        </div>
        <div className="w-full max-w-md mx-auto px-4 py-6 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Non Veg</h2>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="food-swiper"
          >
            {reportData3.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl overflow-hidden bg-card">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.heading1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#f9f3ce]">
                    <h3 className="font-medium ">{item.heading1}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="my-6">
          <h2 className="font-bold text-[25px] px-2 text-center ">
            Personalised Hair Care Products
          </h2>
          <p className="text-center text-btnblue text-[20px] mt-3">
            Our AI has curated a list of products suited to your scalp condition
            and hair goals.
          </p>
        </div>
        <div className="mt-10 relative">
          <div className="absolute m-auto top-[50%] left-1/2 transform -translate-x-1/2 z-20 max-w-full px-4 sm:px-8">
            <Button
              variant="default"
              className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[6px_30px] text-[14px] rounded-[11px] w-full sm:w-auto block sm:hidden h-full py-3"
            >
              Available with paid version
            </Button>
          </div>
          <div className="p-6 bg-[#eaecef] blur-sm rounded-[15px] mb-10 mt-5">
            <Image
              src="/report/Shampoo.jpg"
              alt="not found"
              className="rounded-full border-[7px] border-black w-[300px] h-[300px] m-auto my-10"
              height={400}
              width={400}
            />
            <div className="my-6">
              <h2 className="font-bold text-[25px] px-2 text-center">
                Sulfate-Free Nourishing Shampoo
              </h2>
              <p className="text-blue-600 text-[20px] mt-6 px-5 text-left">
                Our AI has curated a list of products suited to your scalp
                condition and hair goals. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Consequatur officiis, soluta beatae neque eius
                velit debitis facere, dolores
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Analysis = () => {
  return (
    <>
      <div className="hidden md:block">
        <div className="text-center my-10 px-5 pb-12">
          <h1 className="text-2xl font-semibold mb-2">
            Personalised Diet Plan
          </h1>
          <h2 className="text-xl font-normal mb-2">
            Nourish Your Hair from Within
          </h2>
          <p className=" text-btnblue">
            Your hair health is closely linked to your diet. Here’s a customized
            meal plan to provide the nutrients your hair needs:
          </p>
        </div>
        <div className="flex flex-col space-y-10 mt-[-25px] blur-sm">
          <MealPlan heading="For Vegetarians" data={reportData1} />
          <MealPlan heading="For Vegetarians" data={reportData2} />
        </div>
        <div className="text-center my-16 px-5">
          <h1 className="text-2xl font-semibold mb-2">
            Personalised Lifestyle Changes for Healthy Hair
          </h1>
          <h2 className="text-xl font-normal mb-2">Small Habits, Big Impact</h2>
        </div>
        <div className="flex flex-col space-y-10 pb-12 blur-sm">
          <MealPlan heading="For Vegetarians" data={reportData3} />
        </div>
      </div>
      <div className="md:hidden">
        <div className="w-full max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Veg</h2>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="food-swiper"
          >
            {reportData1.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl overflow-hidden bg-card">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.heading1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#f9f3ce]">
                    <h3 className="font-medium min-h-[70px]">
                      {item.heading1}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Non Veg</h2>
          </div>
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="food-swiper"
          >
            {reportData2?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl overflow-hidden bg-card">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.heading1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#f9f3ce]">
                    <h3 className="font-medium min-h-[50px]">
                      {item.heading1}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-3">
          <h2 className="font-bold text-[25px] px-2 text-center ">
            Personalised Lifestyle Changes for Healthy Hair
          </h2>
          <p className="text-center text-[20px] mt-3">
            Small Habits, Big Impact
          </p>
        </div>
        <div className="w-full max-w-md mx-auto px-4 py-6 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Non Veg</h2>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1.8}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="food-swiper"
          >
            {reportData3?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="rounded-xl overflow-hidden bg-card">
                  <div className="relative w-full h-[150px]">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.heading1}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#f9f3ce]">
                    <h3 className="font-medium">{item.heading1}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};
