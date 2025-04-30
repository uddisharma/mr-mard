import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { calculateReadingTime } from "@/lib/calculatetime";

interface PageProps {
  params: { id: number };
}

function removeHtmlCssTags(input: string) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const blog = await db.blog.findUnique({
    where: { id: Number(params.id) },
  });

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const title = `${blog.title} | Milele Health`;
  const description = removeHtmlCssTags(blog.content.slice(0, 160) ?? "");

  return {
    title,
    description,
    openGraph: {
      locale: "en_US",
      url: process.env.NEXT_PUBLIC_BASE_URL + `blogs/${params.id}`,
      type: "website",
      title,
      description,
      images: blog?.image ?? "",
      //@ts-ignore
      twitter: {
        card: "summary_large_image",
        title,
        description,
        image: blog?.image ?? "",
      },
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const blog = await db.blog.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const blogs = await db.blog.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      image: true,
    },
  });

  const getShuffledBlogs = (length: number) => {
    const shuffledBlogs = blogs
      .sort(() => Math.random() - 0.5)
      .slice(0, length);
    return shuffledBlogs;
  };

  if (!blog) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return format(date, "dd MMMM yyyy");
  };

  const timeconsume = (content: string) => {
    return calculateReadingTime(content);
  };

  return (
    <div className="min-h-screen flex flex-col md:px-24 mb-10">
      <main className="flex-grow container mx-auto px-4 py-2 md:py-8">
        <p className="inline-flex items-center text-[#115FD6] mb-3 hover:text-gray-900">
          {blog?.category ?? "Category"}
        </p>
        <div>
          <article>
            {/* Article Header */}
            <h1 className="text-[35px] md:text-[52px] mb-6 text-btnblue">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <Image
                src={blog?.author?.image ?? "/how-we-do/image3.png"}
                alt="Author"
                width={40}
                height={40}
                className="rounded-full h-[40px] w-[40px]"
              />
              <div className="text-[15px] text-gray-600 ">
                <p>
                  By {blog?.author?.name} | Published on{" "}
                  {formatDate(blog.createdAt)} |{" "}
                  {
                    <span>
                      {timeconsume(blog?.content)?.minutes > 0
                        ? timeconsume(blog?.content)?.minutes + " min "
                        : ""}
                      {timeconsume(blog?.content)?.seconds > 0
                        ? timeconsume(blog?.content)?.seconds + " sec"
                        : ""}
                    </span>
                  }{" "}
                  read
                </p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-[400px] mb-8">
              <Image
                src={blog?.image ?? "/blogs3.png"}
                alt="Featured image"
                fill
                className="rounded-lg object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="grid lg:grid-cols-[1fr,320px] gap-12">
              <div>
                <div className="prose max-w-none flex flex-col gap-8">
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                <div className="container mx-auto">
                  <Separator className="mb-3" />
                </div>

                {/* Twitter CTA */}
                <div className="mt-10  text-gray-600">
                  <p className="mb-1">
                    Good or bad, wed love to hear your thoughts. Find us on
                    Twitter{" "}
                    <Link href="https://twitter.com" className="text-blue-500">
                      @twitter
                    </Link>
                  </p>
                  <p className="uppercase text-xs pt-3">
                    WERE ALL ONLY AS HELPFUL AS YOU MAY FIND INTERESTING
                  </p>
                </div>

                {/* Related Posts */}
                <div className="mt-16">
                  <div className="flex flex-col gap-8">
                    {getShuffledBlogs(5)
                      ?.filter((item) => blog.id !== item.id)
                      ?.map((blog, i) => (
                        <Link href={`/blogs/${blog.id}`}>
                          <article key={i} className="hidden md:flex gap-4">
                            <Image
                              src={blog?.image ?? "/blogs2.png"}
                              alt={blog?.title ?? "Blog"}
                              width={180}
                              height={80}
                              className="rounded object-cover"
                            />
                            <div>
                              <h2 className="text-sm text-gray-500 mb-2">
                                PRODUCT •{" "}
                                {
                                  <span>
                                    {timeconsume(blog?.content)?.minutes > 0
                                      ? timeconsume(blog?.content)?.minutes +
                                        " MIN "
                                      : ""}
                                    {timeconsume(blog?.content)?.seconds > 0
                                      ? timeconsume(blog?.content)?.seconds +
                                        " SEC"
                                      : ""}
                                  </span>
                                }{" "}
                                READ
                              </h2>
                              <h3 className="mb-2 text-btnblue">
                                {blog?.title}
                              </h3>
                              <p
                                className="text-sm text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: blog?.content?.slice(0, 100),
                                }}
                              />
                            </div>
                          </article>
                          <article
                            key={i}
                            className="md:hidden flex flex-wrap gap-4"
                          >
                            <Image
                              src={blog?.image ?? "/blogs2.png"}
                              alt={blog?.title ?? "Blog"}
                              width={1000}
                              height={80}
                              className="rounded object-cover"
                            />
                            <div>
                              <h2 className="text-sm text-gray-500 mb-2">
                                PRODUCT •{" "}
                                {
                                  <span>
                                    {timeconsume(blog?.content)?.minutes > 0
                                      ? timeconsume(blog?.content)?.minutes +
                                        " MIN "
                                      : ""}
                                    {timeconsume(blog?.content)?.seconds > 0
                                      ? timeconsume(blog?.content)?.seconds +
                                        " SEC"
                                      : ""}
                                  </span>
                                }{" "}
                                READ
                              </h2>
                              <h3 className="mb-2 text-btnblue">
                                {blog?.title}
                              </h3>
                              <p
                                className="text-sm text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: blog?.content?.slice(0, 100),
                                }}
                              />
                            </div>
                          </article>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              <aside className="space-y-8">
                <div>
                  <h2 className="text-gray-500 mb-4">POPULAR POSTS</h2>
                  <div className="space-y-4">
                    {getShuffledBlogs(4)
                      ?.filter((item) => blog.id !== item.id)
                      ?.map((blog, i) => (
                        <>
                          <article key={i} className="flex gap-4">
                            <Image
                              src={blog?.image ?? "/blogs2.png"}
                              alt={blog?.title ?? "Blog"}
                              width={80}
                              height={60}
                              className="rounded object-cover"
                            />
                            <div>
                              <h2 className="text-sm text-gray-500 mb-2">
                                PRODUCT •{" "}
                                {
                                  <span>
                                    {timeconsume(blog?.content)?.minutes > 0
                                      ? timeconsume(blog?.content)?.minutes +
                                        " MIN "
                                      : ""}
                                    {timeconsume(blog?.content)?.seconds > 0
                                      ? timeconsume(blog?.content)?.seconds +
                                        " SEC"
                                      : ""}
                                  </span>
                                }{" "}
                                READ
                              </h2>
                              <h3 className="text-sm text-btnblue">
                                {blog?.title}
                              </h3>
                            </div>
                          </article>
                          <Separator className="bg-btnblue" />
                        </>
                      ))}
                  </div>
                </div>

                <div className="bg-yellow p-6 rounded-lg text-center">
                  <h2 className=" mb-2 text-[24px]">
                    Get More Done Together With Us
                  </h2>
                  <p className="text-[22px] text-black mb-10">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <Link href="/appointment-booking">
                    <Button className="px-6 py-2  bg-btnblue text-white hover:bg-btnblue/80">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
