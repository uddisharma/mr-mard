import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import QuestionActions from "@/components/admin/actions/questions";
import SearchInput from "@/components/others/SearchInput";
import { Prisma, Resource } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/checkPermission";
import { FormError } from "@/components/others/form-error";
import Pagination from "@/components/admin/pagination";
import ExportButton from "@/components/admin/export";
import { format } from "date-fns";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const where: Prisma.QuestionWhereInput = search
    ? {
        text: {
          contains: search,
          mode: "insensitive" as Prisma.QueryMode,
        },
      }
    : {};

  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const hasPermission = await checkPermission(
    session?.role,
    Resource.QUESTIONS,
    "read",
  );

  if (!hasPermission) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  const questions = await db.question.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { sequence: "asc" },
    include: { options: true },
  });

  const totalQuestions = await db.question.count();
  const totalPages = Math.ceil(totalQuestions / limit);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <main className="container mx-auto py-8">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Questions</h2>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <SearchInput defaultValue={search} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ExportButton type="question" />
            <Link href={"/admin/questions/new"}>
              <Button className="bg-btnblue hover:bg-btnblue/80 text-white">
                + New Question
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[0.5fr_1.5fr_1.5fr_1fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
              <div>Sequence</div>
              <div>Question</div>
              <div>Type</div>
              <div>Created At</div>
              <div>Actions</div>
            </div>

            <div className="divide-y">
              {questions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No questions found
                </div>
              ) : (
                questions.map((question) => (
                  <div
                    key={question.id}
                    className="grid grid-cols-[0.5fr_1.5fr_1.5fr_1fr_auto] gap-4 p-4 items-left justify-left hover:bg-gray-50 text-left"
                  >
                    <div className="text-center">{question.sequence}</div>

                    <div>{question.text}</div>

                    <div>{question.questionType}</div>

                    <div>
                      {format(new Date(question.createdAt), "dd/MM/yyyy")}
                    </div>

                    <div className="flex items-left justify-left ">
                      <QuestionActions
                        question={{ id: question.id, text: question.text }}
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
          total={totalQuestions}
          totalPages={totalPages}
        />
      </main>
    </div>
  );
}
