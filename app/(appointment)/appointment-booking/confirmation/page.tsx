import Confirmation from "@/components/others/confirmation";

export default function ConfirmationPage() {
  return (
    <div className="container max-w-4xl mx-auto mb-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed</h1>
        <p className="text-muted-foreground">
          Your appointment has been successfully booked
        </p>
      </div>
      <Confirmation />
    </div>
  );
}
