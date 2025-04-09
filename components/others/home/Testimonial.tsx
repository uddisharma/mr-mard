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
    dayAgo: "26 days ago",
    content:
      " My hair loss was too much.. I thought i will becomefull bald. Doctor heard everything. He said i am not sleeping and that’s big problem. Told me to sleep early, eat some good food, and gave medicine also. consultation was good, no bakwas..",
    date: "Mr. Mard user, 18/10/2024",
    avatar: "/users/8.png",
  },
  {
    id: 2,
    name: "Balaji",
    role: "",
    star: 5,
    dayAgo: "6 days ago",
    content:
      "My hair was thinning fast... Papa ka genetic lagta hai! Doctor heard me out... said, ‘Genetics hai thodi... but stress mat add karo.’ Suggested relaxing, some supplements... no bs, just straight talk, and hair fall is started slowing down",
    date: "Mr. Mard user, 01/12/2024",
    avatar: "/users/9.png",
  },
  {
    id: 3,
    name: "Srinivas",
    role: "",
    star: 5,
    dayAgo: "10 days ago",
    content:
      "Mr. Mard's treatment is very effective and I am seeing visible results in my hair growth. The personalized kit is a game changer.",
    date: "Mr. Mard user, 01/12/2024",
    avatar: "/users/3.png",
  },
  {
    id: 4,
    name: "Mukesh",
    role: "",
    star: 4,
    dayAgo: "18 days ago",
    content:
      "Hair fall was giving me tension... i was more tensed and hence more hairfall. Doctor was so calm... listened to my rant and said that “you are taking too much stress... relax karo, sleep well”. Gave me ideas like less phone, more rest... super caring, and it’s working",
    date: "Mr. Mard user, 01/12/2024",
    avatar: "/users/4.png",
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
          Real people, real results
        </h2>
        <div className="relative max-w-5xl mx-auto overflow-hidden md:pt-10">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 w-full flex-shrink-0 px-4 py-5 gap-10"
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
