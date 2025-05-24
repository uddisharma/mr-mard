import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ProfileForm from "@/components/others/ProfileForm";
import ProfileHeader from "@/components/others/ProfileHeader";

export const metadata = {
  title: "Profile",
  description: "Profile",
};

export default async function ProfilePage() {
  const session = await currentUser();

  if (!session) {
    return redirect("/auth");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
  });

  if (!user) {
    return redirect("/auth");
  }

  return (
    <div className="min-h-screen px-5 md:px-16 pt-5">
      <ProfileHeader user={user} />
      <div className="rounded-lg bg-white p-6 shadow-sm pb-20">
        <ProfileForm user={user} session={session} />
      </div>
    </div>
  );
}
