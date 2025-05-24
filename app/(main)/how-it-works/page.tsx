import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata = {
  title: "How It Works",
  description: "How It Works",
};

export default function HowWeDoIt() {
  return (
    <div className="text-black md:mx-40">
      <main className="flex-grow container mx-auto px-4 py-2 md:py-8">
        <section className="mb-8">
          <h2 className="text-3xl text-left mb-8 text-[#1A2255]">
            Revolutionizing Hair Wellness with AI - Milele Health
          </h2>
          <p className="text-[#5B5B5B] text-[24px]">Making things fun</p>
          <p className="text-lg my-4">
            At Milele Health, our mission is to redefine mens hair care with the
            power of Artificial Intelligence. This case study showcases how our
            AI-driven bald spot analysis model transforms the way men approach
            hair health.
          </p>
          <Image
            src="/how-we-do/image1.png"
            alt="image1"
            className="w-full h-auto my-16"
            width={500}
            height={500}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl  mb-4">The Problem</h2>
          <p className="mb-4">
            Hair loss and bald spots are common concerns for men, but
            traditional solutions often rely on guesswork. Identifying the
            severity of bald spots and tracking hair health progress is both
            time-consuming and prone to human error.
          </p>
          <Image
            src="/how-we-do/image2.png"
            alt="image1"
            className="w-full h-auto my-16"
            width={500}
            height={500}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl  mb-4">Our Solution</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Accurate Detection: Identifies bald spots and hair density from a
              single photo.
            </li>
            <li>
              Actionable Insights: Generates customized recommendations based on
              individual needs.
            </li>
            <li>
              Progress Tracking: Offers real-time updates to track the
              effectiveness of solutions.
            </li>
          </ul>
          <Image
            src="/how-we-do/image3.png"
            alt="image1"
            className="w-fit h-auto my-16 m-auto"
            width={500}
            height={500}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl  mb-4">How We Do It</h2>
          <ol className=" pl-5 space-y-10">
            <li>
              <h3 className="text-xl ">Step 1: Upload Your Photo</h3>
              <p>
                Users upload a clear photo of their scalp to our secure
                platform. The AI begins analyzing key scalp metrics within
                seconds.
              </p>
            </li>
            <li>
              <h3 className="text-xl ">Step 2: AI-Powered Analysis</h3>
              <p>The model scans for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bald spots and their dimension</li>
                <li>Hair density and follicle health</li>
                <li>Patterns indicating potential hair loss progression</li>
              </ul>
            </li>
            <li>
              <h3 className="text-xl ">Step 3: Generate Insights</h3>
              <p>
                Using dermatological benchmarks and machine learning algorithms,
                the AI delivers:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Scalp health report</li>
                <li>
                  Recommendations for treatments, products, or lifestyle
                  adjustments
                </li>
              </ul>
            </li>
            <li>
              <h3 className="text-xl ">Step 4: Monitor Progress</h3>
              <p>
                Our platform allows users to upload follow-up photos
                periodically. The AI compares new data with past assessments to
                measure improvement and refine recommendations.
              </p>
            </li>
            <li>
              <h3 className="text-xl ">Step 5: Expert Consultation</h3>
              <p>
                For advanced guidance, users can connect with our specialists
                who review AI reports and suggest tailored solutions.
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-12 pt-16">
          <h2 className="text-3xl  mb-10">Results That Matter</h2>
          <h3 className="text-2xl  mb-2">Case Study Example: Client A</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Concern: Receding hairline and thinning at the crown</li>
            <li>AI Findings: 35% hair density reduction in the crown area</li>
            <li>
              Recommendations: Personalized topical treatments and diet
              adjustments
            </li>
            <li>
              Outcome: Visible improvement in density within 6 months, with
              ongoing support from Milele Health.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl  mb-4">Why Our AI Stands Out</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Precision: Backed by dermatological data and machine learning
            </li>
            <li>Privacy: Ensures user data is secure and confidential</li>
            <li>
              Personalization: Every report is unique, focusing on the
              individuals needs
            </li>
            <li>Simplicity: A user-friendly process from start to finish</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl mb-4">Get Started Today</h2>
          <p className="mb-4">
            Experience the next generation of hair wellness. Upload your photo
            and let our AI take care of the rest.
          </p>

          <Button
            variant="default"
            className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[15px_20px] text-[14px] rounded-[10px] py-5"
          >
            Get Analysis
          </Button>
        </section>
      </main>
    </div>
  );
}
