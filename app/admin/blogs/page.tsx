import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import BlogActions from "@/components/admin/actions/blogs";
import SearchInput from "@/components/others/SearchInput";
import { Prisma, Resource } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import Pagination from "@/components/admin/pagination";
import ExportButton from "@/components/admin/export";
import Link from "next/link";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  const where: Prisma.BlogWhereInput = {
    ...(search && {
      OR: [
        {
          title: { contains: search, mode: "insensitive" as Prisma.QueryMode },
        },
        {
          content: {
            contains: search,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
      ],
    }),
    ...(category && { category }),
  };

  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.BLOGS,
    "read",
  );

  if (!hasPermission) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  const blogs = await db.blog.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  const totalBlogs = await db.blog.count({ where });
  const totalPages = Math.ceil(totalBlogs / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Blogs</h2>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="blog" />
            <Link href={"/admin/blogs/new"}>
              <Button className="bg-btnblue hover:bg-btnblue/80 text-white">
                + New Blog
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>Title</div>
              <div>Content</div>
              <div>Author</div>
              <div>Category</div>
              <div>Published</div>
              <div>Actions</div>
            </div>

            <div className="divide-y">
              {blogs.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No Blogs Found
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 p-4 items-left justify-left hover:bg-gray-50 text-left"
                  >
                    <div>{blog.title?.slice(0, 20)}</div>
                    <div
                      className="text-left"
                      dangerouslySetInnerHTML={{
                        __html:
                          blog.content?.slice(0, 50) + "..." || "Big Content",
                      }}
                    />

                    <div>{blog.author?.name}</div>

                    <div>{blog.category}</div>

                    <div>{format(new Date(blog.createdAt), "dd/MM/yyyy")}</div>

                    <div className="flex items-left justify-left ">
                      <BlogActions blog={{ id: blog.id, title: blog.title }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Pagination
          searchParams={searchParams}
          total={totalBlogs}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
