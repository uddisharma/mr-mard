import Header from "@/components/others/header";
import React from "react";
import FAQ from "@/components/others/faq";
import Footer from "@/components/others/footer";
import Hero from "@/components/others/home/Hero";
import Cta from "@/components/others/home/Cta";
import Work from "@/components/others/home/Work";
import Testimonials from "@/components/others/home/Testimonial";
import Chart from "@/components/others/home/Chart";
import Chart1 from "@/components/others/home/Chart1";
import AIInsightsSection from "@/components/others/home/Ai";
import Blogs from "@/components/others/home/Blogs";
import Progress from "@/components/others/home/Progress";
import Analyze from "@/components/others/home/Analyze";
import OurApproach from "@/components/others/home/OurApproach";
import TestingDiagnostics from "@/components/others/home/testing-diagnostics";
import HealthcareSpecialists from "@/components/others/home/HealthcareSpecialists";

const Home = () => {
  return (
    <div className="min-h-screen container m-auto bg-white dark:md:bg-dot-black/[0.2] md:bg-dot-white/[0.2]">
      <Header className="bg-yellow md:pb-20" />
      <Hero />
      <Cta />
      {/* <Work /> */}
      <OurApproach />
      <Progress />
      <Analyze />
      <Testimonials />
      <TestingDiagnostics />
      <Chart />
      <Chart1 />
      <AIInsightsSection />
      <HealthcareSpecialists />
      {/* <Blogs /> */}
      <div className="my-8 md:my-16">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
