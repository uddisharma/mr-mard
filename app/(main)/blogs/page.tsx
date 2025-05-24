import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// import { currentUser } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { checkPermission } from "@/lib/checkPermission";
// import { Resource } from "@prisma/client";
// import { FormError } from "@/components/others/form-error";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { calculateReadingTime } from "@/lib/calculatetime";
import Pagination from "@/components/others/pagination";
import Categories from "@/components/others/categories";
import Newsletter from "@/components/others/newsletter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Blogs",
  description: "Blogs",
};

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Blogs({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  // const session = await currentUser();

  // if (!session) {
  //   return redirect("/auth");
  // }

  // const hasPermission = await checkPermission(
  //   session?.role,
  //   Resource.BLOGS,
  //   "read",
  // );

  // if (!hasPermission) {
  //   return (
  //     <FormError message="You do not have permission to view this content!" />
  //   );
  // }

  const blogs = await db.blog.findMany({
    where: {
      published: true,
      ...(category ? { category } : {}),
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      image: true,
    },
  });

  const totalBlogs = await db.blog.count({ where: { published: true } });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow md:px-24">
        <section className="py-2 md:py-6 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-[32px] font-bold mb-4">
            Stay Updated with Our Latest Blogs
          </h1>
          <p className="text-black">
            Catch up with our latest news and stay in the loop on recent
            updates, insightful stories, and exciting announcements shaping our
            journey forward!
          </p>
        </section>
        <div className="container mx-auto px-4">
          <Separator className="mb-8" />
        </div>

        <section className="container mx-auto px-4 mb-10 md:mb-20">
          <h2 className="text-[24px] mb-6">Recent Post ({totalBlogs})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="relative">
              <Image
                src="/blogs1.png"
                alt="AI Cube"
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-full"
              />
            </div> */}
            {blogs?.length > 0 &&
              blogs?.slice(0, 2)?.map((blog, i) => (
                <Link
                  key={i}
                  className="bg-[#EDDE79] rounded-lg p-8 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] border-solid border-[1px] border-[#252525]"
                  href={`/blogs/${blog?.id}`}
                >
                  <div>
                    <div>
                      <div className="flex items-center gap-2 text-sm mb-2 text-gray1 font-semibold">
                        <span>{format(blog?.createdAt, "dd MMMM yyyy")}</span>
                        <span>•</span>
                        <span>
                          {calculateReadingTime(blog?.content).minutes > 0
                            ? calculateReadingTime(blog?.content).minutes +
                              " min "
                            : ""}
                          {calculateReadingTime(blog?.content).seconds > 0
                            ? calculateReadingTime(blog?.content).seconds +
                              " sec"
                            : ""}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold">
                        {blog?.title?.slice(0, 70) ?? "Title"}
                      </h3>
                      <p
                        className="text-black mt-2"
                        dangerouslySetInnerHTML={{
                          __html: blog?.content?.slice(0, 200) ?? "Content",
                        }}
                      />
                    </div>
                    <Link href={`/blogs/${blog?.id}`}>
                      <Button
                        variant="default"
                        className="self-start mt-5 bg-btnblue text-white hover:bg-btnblue/80 p-[8px_12px] text-[14px] rounded-[10px]"
                      >
                        Read More
                      </Button>
                    </Link>
                  </div>
                </Link>
              ))}
          </div>
        </section>
        <div className="container mx-auto px-4 ">
          <Separator className="mb-8 md:mt-14" />
        </div>

        {!blogs?.length ? (
          <h2 className="text-2xl mb-10 text-center py-20">No Blogs Found</h2>
        ) : (
          <>
            <section className="container mx-auto px-4 mb-20">
              <h2 className="text-2xl mb-6">Weekly Most Read</h2>
              <div className="grid md:grid-cols-3 gap-x-6 gap-y-12">
                {blogs?.slice(2)?.map((blog, i) => {
                  const formattedDate = format(blog.createdAt, "dd MMMM yyyy");
                  const timeconsume = calculateReadingTime(blog.content);
                  return (
                    <Link key={i} href={`/blogs/${blog?.id}`}>
                      <article className="cursor-pointer flex flex-col">
                        <div className="relative h-[200px] mb-4">
                          <Image
                            src={blog?.image ?? "/blogs2.png"}
                            alt={blog?.title ?? "Blog"}
                            fill
                            className="rounded-lg "
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
                          {blog?.title?.slice(0, 30) ?? "Title"}
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
                            className="self-start bg-btnblue text-white hover:bg-btnblue/80 p-[8px_12px] text-[14px] rounded-[11px] "
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
            <Pagination
              totalPages={totalBlogs ? Math.ceil(totalBlogs / limit) : 1}
              currentPage={Number(page)}
            />
            <div className="container mx-auto px-4">
              <Separator className="" />
            </div>
          </>
        )}
      </main>

      <Categories />

      <Newsletter />
    </div>
  );
}
