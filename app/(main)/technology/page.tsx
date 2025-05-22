"use client";
import ProcessCard from "@/components/others/process-card";
import WhyChooseUs from "@/components/others/why-choose-us";
import FAQ from "@/components/others/faq";
import { Button } from "@/components/ui/button";

export default function Home() {
  const processes = [
    {
      number: 1,
      title: "Data Acquisition",
      heading: "The process begins with the user:",
      content: [
        "Image Upload: Users upload high-resolution images of their scalp.",
        "Guidelines: Specific instructions ensure image consistency, such as uniform lighting and a focused scalp view.",
        "Data Security: Images are encrypted using AES-256 standards and stored temporarily for analysis to maintain user privacy.",
      ],
      imageSrc: "/ai.png",
      imageAlt: "Data Acquisition Illustration",
    },
    {
      number: 2,
      title: "Image Preprocessing",
      heading:
        "To prepare the images for analysis, we implement a preprocessing pipeline:",
      content: [
        "Noise Reduction: Filters out background noise and irrelevant data using Gaussian Blur techniques.",
        "Edge Detection: Employs algorithms like Canny Edge Detection to outline the scalp and hair boundaries.",
        "Image Rescaling and Normalization: Ensures uniform resolution and intensity for consistent input across the model.",
        "Scalp Region Segmentation: Implements semantic segmentation using Convolutional Neural Networks (CNNs), such as U-Net, to identify and isolate the scalp area from hair, skin, and background.",
      ],
      imageSrc: "/ai/ai2.png",
      imageAlt: "Image Preprocessing Illustration",
    },
    {
      number: 3,
      title: "Deep Learning-Based Analysis",
      heading: "Our proprietary AI model is the core of the process:",
      content: [
        "Feature Extraction: Utilizes pretrained CNN architectures, such as ResNet or EfficientNet, to identify patterns related to bald spots and hair density.",
        "Hair Density Analysis: Analyzes pixel intensity variations to calculate follicular density.",
        "Detects bald regions using Object Detection models like YOLO (You Only Look Once)",
        "Maps bald spot dimensions and location relative to the entire scalp area.",
        // "Texture Analysis: Detects dryness or oiliness using Gray Level Co-occurrence Matrix (GLCM).",
        // "Follicle Health: Predicts follicle health by analyzing shadow and root patterns in hair clusters."
      ],
      imageSrc: "/ai/ai3.png",
      imageAlt: "Deep Learning Analysis Illustration",
    },
    {
      number: 4,
      title: "Insight Generation",
      heading:
        "Once the analysis is complete, the AI model generates a comprehensive report:",
      content: [
        "Visual Heatmaps: Displays affected areas and highlights thinning zones using Grad-CAM (Gradient-weighted Class Activation Mapping).",
        "Hair Density Score: Number of follicles per square centimeter.",
        "Bald Spot Severity Index: Scaled from 1 to 10 for treatment prioritization.",
        "Suggests treatments (e.g., topical solutions, laser therapies).",
        "Proposes lifestyle adjustments like dietary changes or stress management.",
      ],
      imageSrc: "/ai/ai4.png",
      imageAlt: "Insight Generation Illustration",
    },
    {
      number: 5,
      title: "Reinforcement Learning for Continuous Improvement",
      heading: "Our model evolves to become smarter with every analysis:",
      content: [
        "User Feedback Integration: Results are compared with user-provided feedback to refine model accuracy.",
        "Data Augmentation: Uses new scalp images to train the model, expanding the dataset with synthetic variations to improve generalization.",
        "Dynamic Adaptability: The AI learns from trends in scalp conditions and adapts its recommendations accordingly.",
      ],
      imageSrc: "/ai/ai5.png",
      imageAlt: "Reinforcement Learning Illustration",
    },
    {
      number: 6,
      title: "Progress Monitoring",
      heading:
        "Tracking improvements is key to effective hair health management:",
      content: [
        "Time-Series Analysis: Compares sequential images to monitor hair growth or treatment efficacy.",
        "Delta Reports: Highlights changes in hair density, bald spot dimensions, and overall scalp health.",
      ],
      imageSrc: "/ai/ai6.png",
      imageAlt: "Progress Monitoring Illustration",
    },
    {
      number: 7,
      title: "Expert Consultation and Review",
      heading:
        "AI analysis is further validated by dermatologists and trichologists:",
      content: [
        "Human Oversight: Specialists review AI-generated reports to enhance reliability.",
        "Customized Plans: Combines AI precision with expert insights to create holistic treatment plans.",
      ],
      imageSrc: "/ai/ai7.png",
      imageAlt: "Expert Consultation Illustration",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="md:px-4 md:py-8 px-5">
        {/* bg-[url('/hero.png')] bg-cover bg-center */}
        <div className=" py-4 mb-8 md:mb-16">
          <h1 className="text-4xl text-center mb-5">How Our AI Model Works</h1>

          <p className="text-btnblue">
            At Milele Health, we leverage cutting-edge Artificial Intelligence
            and Machine Learning (ML) technologies to analyze, detect, and
            deliver actionable insights for hair health. Our AI-driven bald spot
            detection system ensures precision and efficiency by blending
            computer vision, neural networks, and dermatological expertise.
          </p>
        </div>

        <div className="space-y-8">
          {processes.map((process, index) => (
            <ProcessCard key={index} {...process} />
          ))}
        </div>

        <WhyChooseUs />

        <div className="my-16 md:px-16 bg-white rounded-[144px] md:p-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Start your Hair care journey today!
          </h2>
          <p className="text-btnblue mb-8">
            Experience cutting edge hair health diagnosis using AI. Get
            real-time personalized insights for your hair.
          </p>
          <Button
            size="lg"
            className="bg-btnblue hover:bg-btnblue rounded-[12px] text-white py-5"
          >
            Get free trial access
          </Button>
        </div>

        <FAQ />
      </main>
    </div>
  );
}
