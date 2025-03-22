import { db } from "@/lib/db";
import ReportActions from "@/components/admin/actions/reports";
import { Prisma, Resource } from "@prisma/client";
import SearchInput from "@/components/others/SearchInput";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import Pagination from "@/components/admin/pagination";
import { format } from "date-fns";
import ExportButton from "@/components/admin/export";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const where: Prisma.ReportWhereInput = search
    ? {
        OR: [
          {
            user: {
              firstName: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          },
          {
            user: {
              lastName: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
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
    Resource.REPORTS,
    "read",
  );

  if (!hasPermission) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  const reports = await db.report.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const totalReports = await db.report.count({ where });
  const totalPages = Math.ceil(totalReports / limit);

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
            <ExportButton type="report" />
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>User</div>
              <div className="text-center">Email</div>
              <div className="text-center">Questions</div>
              <div className="text-center">Created At</div>
              <div className="text-center">Actions</div>
            </div>

            <div className="divide-y">
              {reports.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No reports found
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 p-4 items-left justify-left hover:bg-gray-50 text-left"
                  >
                    <div>
                      {report.user.firstName} {report.user.lastName}
                    </div>

                    <div className="text-center">{report.user.email}</div>

                    <div className="text-center">
                      {report?.questions?.length} questions
                    </div>

                    <div className="text-center">
                      {format(new Date(report.createdAt), "dd/MM/yyyy")}
                    </div>

                    <div className="flex items-left justify-left ">
                      <ReportActions
                        report={{
                          id: report.id,
                          name: report?.user?.firstName ?? "",
                        }}
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
          total={totalReports}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
