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

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
        <p className="text-muted-foreground">
          Start by verifying your phone number
        </p>
      </div>
      <PhoneVerification phone={user?.phone} id={session?.id} />
    </div>
  );
}
