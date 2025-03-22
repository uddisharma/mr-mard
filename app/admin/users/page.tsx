import { db } from "@/lib/db";
import UserActions from "@/components/admin/actions/UserActions";
import { Prisma, Resource } from "@prisma/client";
import SearchInput from "@/components/others/SearchInput";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import Pagination from "@/components/admin/pagination";
import { format } from "date-fns";
import ExportButton from "@/components/admin/export";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          {
            firstName: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }
    : {};

  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.USERS,
    "read",
  );

  if (!hasPermission) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  const users = await db.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = await db.user.count({ where });
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Reports</h2>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="user" />
            <Link href={"/admin/users/new"}>
              <Button className="bg-btnblue hover:bg-btnblue/80 text-white">
                + New User
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Created At</div>
              <div>Actions</div>
            </div>

            <div className="divide-y">
              {users.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No users found
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_auto] gap-4 p-4 items-left justify-left hover:bg-gray-50 text-left"
                  >
                    <div>{user?.name}</div>

                    <div>{user.email}</div>
                    <div>{user.role}</div>

                    <div>{format(new Date(user.createdAt), "dd/MM/yyyy")}</div>

                    <div className="flex items-left justify-left ">
                      <UserActions
                        user={{ id: user.id, name: user?.name ?? "" }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <Pagination
          searchParams={searchParams}
          total={totalUsers}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
