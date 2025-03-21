import { Prisma } from "@prisma/client";
import SearchInput from "@/components/others/SearchInput";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import { db } from "@/lib/db";
import ExportButton from "@/components/admin/export";
import { format } from "date-fns";
import Pagination from "@/components/admin/pagination";
import LeadActions from "@/components/admin/actions/leads";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SubmissionsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const where: Prisma.LeadsWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(session?.role, "LEADS", "read");

  if (!hasPermission) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  const leads = await db.leads.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const totalleads = await db.leads.count({ where });
  const totalPages = Math.ceil(totalleads / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Leads</h2>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="leads" />
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>Name</div>
              <div>Phone</div>
              <div>Created At</div>
              <div>Actions</div>
            </div>

            <div className="divide-y">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="grid grid-cols-[1.5fr_1.5fr_1.5fr_auto] gap-4 p-4 items-left justify-left hover:bg-gray-50 text-left"
                >
                  <div>{lead?.name}</div>
                  <div>{lead?.phone}</div>

                  <div>{format(new Date(lead.createdAt), "dd/MM/yyyy")}</div>

                  <div className="flex items-left justify-left ">
                    <LeadActions lead={{ id: lead.id, name: lead.name }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Pagination
          searchParams={searchParams}
          total={totalleads}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
