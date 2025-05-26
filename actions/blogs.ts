"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { BlogSchema, type BlogFormData } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
//@ts-ignore
import { Resource } from "@prisma/client";

export async function addBlog(blogData: BlogFormData) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.BLOGS,
    "create",
  );

  if (!hasPermission) {
    return { message: "You don't have permission to create a blog" };
  }

  const validatedData = BlogSchema.parse(blogData);

  const lastBlog = await db.blog.findFirst({
    orderBy: { id: "desc" },
  });

  const blog = await db.blog.create({
    data: {
      ...validatedData,
      authorId: session?.id,
      id: lastBlog?.id ? lastBlog.id + 1 : 1,
    },
  });

  revalidatePath("/admin/blogs");
  return blog;
}

export async function updateBlog(id: number, blogData: BlogFormData) {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.BLOGS,
    "update",
  );

  if (!hasPermission) {
    return { message: "You don't have permission to update a blog" };
  }

  const validatedData = BlogSchema.parse(blogData);

  const blog = await db.blog.update({
    where: { id: Number(id) },
    data: validatedData,
  });

  revalidatePath("/admin/blogs");
  revalidatePath(`/admin/blogs/${id}`);
  return blog;
}

export const getBlogs = unstable_cache(
  async () => {
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
      return { message: "You don't have permission to read blogs" };
    }

    return db.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
  },
  ["blogs"],
  { revalidate: 60 }, // Revalidate every 60 seconds
);
