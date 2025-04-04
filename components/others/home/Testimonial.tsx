"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ReactStars from "react-stars";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  star: number;
  dayAgo: string;
  content: string;
  date: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "kotesh",
    role: "",
    star: 4,
    dayAgo: "2 days ago",
    content:
      "Using Mard’s treatment for 5 months can feel the change in my hair, definitely",
    date: "Mr. Mard user, 18/10/2024",
    avatar: "/users/8.png",
  },
  {
    id: 2,
    name: "Balaji",
    role: "",
    star: 5,
    dayAgo: "2 days ago",
    content:
      "I got Mard's treatment kit after consulting its doctor , the kit was personalized as per my hair issues and after using it I sawx noticeable hair growth. ",
    date: "Mr. Mard user, 01/12/2024",
    avatar: "/users/9.png",
  },
  {
    id: 3,
    name: "Balaji",
    role: "",
    star: 5,
    dayAgo: "2 days ago",
    content:
      "I got Mard's treatment kit after consulting its doctor , the kit was personalized as per my hair issues and after using it I sawx noticeable hair growth. ",
    date: "Mr. Mard user, 01/12/2024",
    avatar: "/users/9.png",
  },
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const slidesPerView = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(testimonials.length / slidesPerView);

  const toggleReadMore = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl bg-white text-center text-btnblue py-6 mb-2">
          What Our Users Say
        </h2>

        <div className="relative max-w-5xl mx-auto overflow-hidden md:pt-10">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className="flex w-full flex-shrink-0 px-4 py-5 gap-10"
              >
                {testimonials
                  .slice(
                    index * slidesPerView,
                    index * slidesPerView + slidesPerView,
                  )
                  .map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      className="w-full mx-2 bg-[#f7f6fb] 
                      rounded-[12px] h-fit"
                      style={{
                        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.45)",
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-2">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={testimonial.avatar}
                              alt={testimonial.name}
                            />
                            <AvatarFallback>
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {testimonial.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-[-5px] mb-1">
                                <ReactStars
                                  value={testimonial.star}
                                  size={18}
                                  color2={"#ffd700"}
                                  className="rounded-full"
                                  edit={false}
                                  half={false}
                                />
                                <span className="text-sm text-gray-500">
                                  {testimonial.dayAgo}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {expandedCard === testimonial.id
                            ? testimonial.content
                            : `${testimonial.content?.slice(0, 80)}...`}
                        </p>
                        <button
                          onClick={() => toggleReadMore(testimonial.id)}
                          className="text-btnblue font-normal text-sm"
                        >
                          {expandedCard === testimonial.id
                            ? "Read Less"
                            : "Read More"}
                        </button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 mt-6 pb-8 md:pb-12">
          <Button variant="ghost" onClick={prevSlide}>
            <ChevronLeft className="h-6 w-6 text-[#6a7176]" />
          </Button>
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? "bg-[#1e2756]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <Button variant="ghost" onClick={nextSlide}>
            <ChevronRight className="h-6 w-6 text-[#6a7176]" />
          </Button>
        </div>
      </div>
    </section>
  );
}
