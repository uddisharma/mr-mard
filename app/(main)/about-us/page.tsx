import Image from "next/image";

export const metadata = {
  title: "About Us",
  description: "About Us",
};

export default function AboutUs() {
  return (
    <div className="text-black md:mx-24">
      <main className="container mx-auto px-4 py-2 md:py-6">
        <h2 className="text-[35px] md:text-[40px] text-center mb-8">
          About Us
        </h2>

        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="text-[28px] mb-4">What Milele Means</h2>
          <p className="mb-4">
            Milele means forever — and that’s the kind of health we’re
            envisioning for every Indian.
          </p>
          <p className="mb-4">
            At Milele Health, we believe real transformation isn’t magic—it’s a
            process grounded in patience, consistency, and knowledge. We’re here
            to redefine hair wellness by making hair care less confusing and
            more effective.
          </p>
        </section>

        {/* Who We Are */}
        <section className="mb-12">
          <h2 className="text-[28px] mb-4">What We Stand For</h2>
          <p className="mb-4">
            We exist to fill the gaps in a system that has long overlooked
            deeply personal yet critical health concerns like hair loss.
          </p>
          <p className="mb-4">
            By combining medical expertise, smart technology, and patient-first
            care, we’ve envisioned building India’s top trusted healthcare
            ecosystem for hair wellness—breaking through the noise, stigma, and
            misinformation.
          </p>
          <p>
            At Milele Health, every recommendation is rooted in science and
            designed to empower you with clarity, not confusion.
          </p>
        </section>

        {/* Founders Section with Image */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 align-middle justify-center items-center">
            <div className="md:w-1/2">
              <Image
                src="/about-us.webp"
                alt="Founders"
                width={550}
                height={300}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-[28px] mb-4">Who We Are</h2>
              <p className="mb-4">
                Founded by Santhosh and Naveen, former colleagues at Swiggy,
                Milele Health began as a shared mission to solve a problem we
                faced ourselves: lack of clarity and support in hair wellness.
              </p>
              <p className="mb-4">
                With Naveen’s background in program management and Santhosh’s
                expertise in business analytics, we combine data, empathy, and
                real-world experience to fill the gap.
              </p>
            </div>
          </div>
        </section>

        {/* Why We Started */}
        <section className="mb-12">
          <h2 className="text-[28px] mb-4">Why We Started</h2>
          <p className="mb-4">
            Grooming is more than skin deep—it impacts confidence, self-image,
            and mental well-being.
          </p>
          <p className="mb-4">
            We saw friends and peers silently struggle with issues like hair
            loss, unsure of what to do or who to trust. Milele Health was
            created to change that.
          </p>
          <p>
            We’re building a safe, supportive space for men to talk openly,
            learn, and take charge of their wellness journey.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-12">
          <h2 className="text-[28px] mb-4">Our Vision</h2>
          <p className="mb-4">
            We want to normalize conversations around men’s health and grooming.
            Our vision is a world where a cap is worn for style—not to hide hair
            loss.
          </p>
          <p>
            By offering the right tools, knowledge, and support, we help turn
            everyday grooming into an act of self-care.
          </p>
        </section>

        {/* Join Us */}
        <section className="mb-12 pb-16">
          <h2 className="text-[28px] mb-4">Join the Movement</h2>
          <p>
            Join us in changing the way men approach wellness. Step by step,
            choice by choice, we’re in this together.
          </p>
        </section>
      </main>
    </div>
  );
}
