import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AIInsightsSection() {
  return (
    <section className="container text-center md:text-left mx-auto px-4 md:px-24">
      <h2 className="text-3xl md:text-4xl text-center text-btnblue  py-2 md:py-8 mb-12 bg-white">
        Our Advance AI Model
      </h2>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-square max-w-[600px] rounded-[144px] bg-yellow p-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative ">
              <Image
                src="/ai1.png"
                className="rounded-[12px]"
                alt="AI Insights"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            AI-Powered Baldness Insights
          </h2>
          <p className="text-xl text-muted-foreground ">
            Get personalized recommendations and optimize Plans with our
            AI-powered insights.
          </p>
          <div className="mt-10">
            <Link href="/technology">
              <Button
                size="lg"
                className="bg-btnblue hover:bg-btnblue/90 rounded-[12px]"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
