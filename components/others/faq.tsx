"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Why is professional diagnosis important for hair loss?",
    answer:
      "Hair loss can have multiple causes, such as genetics, lifestyle, diet, or underlying health issues. Self-diagnosis often leads to incorrect treatment, wasting time and money. At Milele health, our experienced doctors provide a thorough diagnosis to ensure you receive the right treatment from the start.",
  },
  {
    question: "What can I expect during the 20-minute consultation?",
    answer:
      "During the consultation, our doctor will spend time understanding your hair concerns, explaining the possible causes, recommending lifestyle and diet changes, prescribing necessary medications, and discussing potential side effects. This ensures you are fully informed and equipped with a clear treatment plan.",
  },
  {
    question: "How can I book a consultation with Milele health?",
    answer: "You can book a consultation online through this link",
  },
  {
    question:
      "How does Milele health ensure consistent and accurate diagnoses?",
    answer:
      "At Milele Health, our doctors bring years of specialized experience in hair loss to every consultation, delivering diagnoses you can trust. We prioritize quality over quick fixes—carefully analyzing your hair and scalp via video call—so you get a clear answer.",
  },
  {
    question: "Why is a Milele Health virtual consultation worth it?",
    answer:
      "With Milele Health, you’re investing in 20 minutes of undivided attention from a hair loss expert—live on video—who delivers a pinpoint diagnosis and a plan customized to your hair. It’s not just a consultation; it’s the key to stopping hair loss for good, saving you from wasting hundreds on useless products or repeat visits elsewhere.",
  },
  {
    question: "How is the treatment at Milele health personalized?",
    answer:
      "Each customer is unique, and so are their hair problems. Our doctors customize the treatment plan based on your specific diagnosis, medical history, and lifestyle. This ensures the best possible outcome for you.",
  },
  {
    question:
      "What lifestyle and diet changes might be recommended during the consultation?",
    answer:
      "Depending on your condition, our doctors may suggest changes such as reducing stress, improving sleep quality, incorporating hair-friendly nutrients (like proteins and vitamins) into your diet, or adjusting your hair care routine to promote hair health.",
  },
  {
    question: "How does Milele health address early-stage hair loss?",
    answer:
      "We believe early intervention is the secret to keeping your hair—13% of men get told ‘it’s nothing’ and lose their chance to fight back. In consultation, our experienced doctors use video based evaluation to spot the subtle signs others miss, then craft a simple, effective plan to stop hair loss before it takes hold. It’s proactive care that’s less invasive and built for results.",
  },
  {
    question:
      "Can I get a second opinion or clarify previous diagnoses at Milele health?",
    answer:
      "Absolutely. If you've had previous consultations elsewhere, our doctors can review your history and provide a fresh perspective. This ensures you have a clear understanding of your condition and a consistent treatment plan.",
  },
  {
    question: "Are there any side effects to the medications prescribed?",
    answer:
      "Our doctors will discuss potential side effects of any prescribed medications during the consultation. This ensures you are fully aware and comfortable with your treatment plan before proceeding.",
  },
  {
    question: "Why does Milele health focus on diagnosis as the first step?",
    answer:
      "Diagnosis is crucial because it identifies the root cause of your hair loss. Without a proper diagnosis, any treatment might be ineffective or even harmful. At Milele health, we prioritize getting it right from the beginning to ensure long-term success.",
  },
  {
    question:
      "How does Milele health ensure trust and reliability in its services?",
    answer:
      "We build trust through transparency, expertise, and results. Our doctors are experienced professionals, and we follow ethical practices. We also provide guarantees on our treatments and encourage feedback from our customers to continuously improve our services.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mb-16 px-4 md:px-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
        FAQs
      </h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:hidden">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white rounded-lg shadow-sm transition-all h-fit"
          >
            <button
              className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-100 transition"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-medium text-base md:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className={`transform transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-[300px] p-4 pt-0 h-fit" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="md:grid gap-4 sm:grid-cols-1 md:grid-cols-2 hidden">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-200 bg-white rounded-lg shadow-sm transition-all h-fit"
            >
              <button
                className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-100 transition"
                onClick={() => toggleAccordion(index)}
              >
                <span
                  className={`text-base md:text-lg font-medium flex-1 transition-all duration-300 ${
                    isOpen ? "whitespace-normal" : "truncate"
                  }`}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`ml-2 flex-shrink-0 transform transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[300px] p-4 pt-0 h-fit" : "max-h-0"
                }`}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
