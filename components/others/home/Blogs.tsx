"use client";
import { Button } from "@/components/ui/button";
import { calculateReadingTime } from "@/lib/calculatetime";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Blogs = ({ blogs }: any) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const BlogCard = ({ blog }: any) => {
    const formattedDate = format(blog.createdAt, "dd MMMM yyyy");
    const timeconsume = calculateReadingTime(blog.content);

    return (
      <Link href={`/blogs/${blog?.id}`}>
        <article className="cursor-pointer flex flex-col">
          <div className="relative h-[200px] mb-4 border-[1px] border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={blog?.image ?? "/blogs2.png"}
              alt={blog?.title ?? "Blog"}
              // height={240}
              // width={800}
              fill
              className="w-full h-full"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray1 mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>
              {timeconsume?.minutes > 0 ? `${timeconsume.minutes} min ` : ""}
              {timeconsume?.seconds > 0 ? `${timeconsume.seconds} sec` : ""}
            </span>
          </div>
          <h3 className="text-[16px] md:text-[20px] mb-3 text-btnblue">
            {blog?.title?.slice(0, 50) ?? ""}
          </h3>
          <p
            className="text-gray-500 text-[13px] md:text-[15px] mb-4 flex-grow"
            dangerouslySetInnerHTML={{
              __html: blog?.content?.slice(0, 150) + "...",
            }}
          />
          <Button
            variant="default"
            className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[6px_12px] text-[14px] rounded-[11px] py-5 px-8"
          >
            Read More
          </Button>
        </article>
      </Link>
    );
  };

  return (
    <div className="mt-5 bg-white pb-5 mb-5">
      <h2 className="text-2xl md:text-4xl text-center text-btnblue py-5">
        Our Blogs
      </h2>

      <div className="flex justify-center m-auto mb-10">
        <Link href={`/blogs`}>
          <div className="bg-btnblue text-white px-6 py-2 rounded-full">
            View All
          </div>
        </Link>
      </div>

      <section className="container mx-auto px-4 md:px-24">
        {/* Mobile Slider */}
        <div className="block md:hidden">
          <Slider {...settings}>
            {blogs?.map((blog: any, i: number) => (
              <div key={i} className="px-2">
                <BlogCard blog={blog} />
              </div>
            ))}
          </Slider>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-x-6 gap-y-12">
          {blogs
            ?.slice(0, 3)
            ?.map((blog: any, i: number) => <BlogCard key={i} blog={blog} />)}
        </div>
      </section>
    </div>
  );
};

export default Blogs;

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute bg-white rounded-full top-1/2 right-[-10px] transform -translate-y-1/2 z-10 cursor-pointer p-2"
      onClick={onClick}
    >
      <ChevronRight size={24} className="text-btnblue" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute bg-white rounded-full p-2 top-1/2 left-[-10px] transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <ChevronLeft size={24} className="text-btnblue" />
    </div>
  );
};
