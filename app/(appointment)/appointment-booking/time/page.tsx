import TimeSlotPicker from "@/components/others/time-slot-picker";

export default function TimeSelectionPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Select a Time Slot</h1>
        <p className="text-muted-foreground">
          Choose an available time for your appointment
        </p>
      </div>
      <TimeSlotPicker />
    </div>
  );
}
