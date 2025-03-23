import PhoneVerification from "@/components/others/phone-verification";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function BookingPage() {
  const session = await currentUser();

  const user = session
    ? await db.user.findUnique({
        where: { id: session.id },
        select: { phone: true },
      })
    : null;

  return <PhoneVerification phone={user?.phone} id={session?.id} />;
}
