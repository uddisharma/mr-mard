import ProfileCard from "@/components/others/profile-card";
import ProfileForm from "@/components/others/profile-form";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseTimeRange } from "@/lib/parseTimeRange";
import { redirect } from "next/navigation";

async function fetchStats(timeRange: string | null) {
  const startDate = parseTimeRange(timeRange);

  const [newUsers, reports, questions] = await Promise.all([
    db.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    }),
    db.report.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    }),
    db.question.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    }),
  ]);

  return { newUsers, reports, questions };
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { timeRange?: string };
}) {
  const session = await currentUser();

  // if (!session) {
  //   return redirect("/");
  // }

  const admin = await db.user.findUnique({
    where: { id: session?.id },
    select: {
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      location: true,
      image: true,
      role: true,
    },
  });

  const { timeRange } = searchParams;
  const stats = await fetchStats(timeRange || null);

  return (
    <main className="p-4 sm:p-6 ">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <div className="bg-yellow h-[270px] w-full border-b rounded-xl">
        <div className="grid lg:grid-cols-[300px,1fr] gap-6 px-4 sm:px-5 pt-16 md:pt-32">
          <ProfileCard admin={admin} stats={stats} />
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border-[1px] border-whiteGray">
            <ProfileForm admin={admin} />
          </div>
        </div>
      </div>
    </main>
  );
}
