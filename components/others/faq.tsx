"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Mr. Mard?",
    answer:
      "Mr. Mard is an advanced AI-powered analysis platform that helps understand and improve mental health patterns.",
  },
  {
    question: "How does Mr. Mard work?",
    answer:
      "Our platform uses advanced AI algorithms to analyze various parameters and provide comprehensive insights into mental health patterns.",
  },
  {
    question: "Do you store images of your faces?",
    answer:
      "We prioritize your privacy and security. All analysis is done in real-time and no facial images are stored on our servers.",
  },
  {
    question: "What is the accuracy of our AI Model?",
    answer:
      "Our AI model has been trained on a vast dataset and has achieved an accuracy rate of over 95% in identifying mental health patterns.",
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
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
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
    </section>
  );
}
