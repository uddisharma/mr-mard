import Header from "@/components/others/header";
import React from "react";
import FAQ from "@/components/others/faq";
import Footer from "@/components/others/footer";
import Hero from "@/components/others/home/Hero";
import Cta from "@/components/others/home/Cta";
import Testimonials from "@/components/others/home/Testimonial";
import Blogs from "@/components/others/home/Blogs";
import OurApproach from "@/components/others/home/OurApproach";
import TestingDiagnostics from "@/components/others/home/testing-diagnostics";
import ConsultationButton from "@/components/others/ConsultationButton";
import Image from "next/image";

const images = ["/users/4.png", "/users/5.png", "/users/6.png", "/users/7.png"];

const Home = () => {
  return (
    <div className="min-h-screen container m-auto bg-white dark:md:bg-dot-black/[0.2] md:bg-dot-white/[0.2] relative">
      <Header className="bg-yellow md:pb-20" />
      <Hero />
      <Cta />
      {/* <Work /> */}
      <OurApproach />
      {/* <Progress /> */}
      {/* <Analyze /> */}
      <Testimonials />
      <div className="md:pt-10 md:mb-12 md:pb-10 bg-white">
        <div className="md:hidden flex flex-col items-center justify-center text-center  relative py-7 md:pb-10 ">
          <div className="flex gap-3 z-10 items-center">
            <h2 className="text-2xl font-semibold text-black">
              1000<span className="text-[#000]">+</span>
            </h2>
            <p className="text-lg text-black">Happy Customers</p>
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

        <div className="hidden md:flex flex-wrap items-center justify-center gap-2 ">
          <div className="text-3xl font-bold">1000+</div>
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
      <TestingDiagnostics />
      {/* <Chart />
      <Chart1 /> */}
      {/* <AIInsightsSection /> */}
      {/* <HealthcareSpecialists /> */}
      <Blogs />
      <div className="my-8 md:my-16">
        <FAQ />
      </div>
      <Footer />
      <ConsultationButton />
    </div>
  );
};

export default Home;
