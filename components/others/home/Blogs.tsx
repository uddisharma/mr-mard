import { Button } from "@/components/ui/button";
import { calculateReadingTime } from "@/lib/calculatetime";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";

const Blogs = async () => {
  const blogs = await db.blog.findMany({
    where: {
      published: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      image: true,
    },
  });

  return (
    <div className="mt-10 bg-white pb-5 mb-5">
      <h2 className="text-3xl md:text-4xl text-center text-btnblue py-8 mb-2">
        Our Blogs
      </h2>
      <div className="flex justify-center m-auto mb-10">
        <Link href={`/blogs`}>
          <Button
            variant="default"
            className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[6px_30px] text-[14px] rounded-[11px] py-5"
          >
            View All
          </Button>
        </Link>
      </div>
      <section className="container mx-auto px-4 md:px-24 ">
        <div className="grid md:grid-cols-3 gap-x-6 gap-y-12">
          {blogs?.map((blog, i) => {
            const formattedDate = format(blog.createdAt, "dd MMMM yyyy");
            const timeconsume = calculateReadingTime(blog.content);
            return (
              <Link key={i} href={`/blogs/${blog?.id}`}>
                <article className="cursor-pointer flex flex-col">
                  <div className="relative h-[240px] mb-4 border-[1px] border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={blog?.image ?? "/blogs2.png"}
                      alt={blog?.title ?? "Blog"}
                      height={240}
                      width={300}
                      className="w-[90%] rounded-none h-full m-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray1 font-semibold mb-2">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>
                      {timeconsume?.minutes > 0
                        ? timeconsume.minutes + " min "
                        : ""}
                      {timeconsume?.seconds > 0
                        ? timeconsume.seconds + " sec"
                        : ""}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {blog?.title?.slice(0, 50) ?? ""}
                  </h3>
                  <p
                    className="text-black text-sm mb-4 flex-grow"
                    dangerouslySetInnerHTML={{
                      __html: blog?.content?.slice(0, 150) ?? "",
                    }}
                  />

                  <Link href={`/blogs/${blog?.id}`}>
                    <Button
                      variant="default"
                      className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[6px_12px] text-[14px] rounded-[11px] py-5 px-8"
                    >
                      Read More
                    </Button>
                  </Link>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
