import DatePicker from "@/components/others/date-picker";

export default function DateSelectionPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Select a Date</h1>
        <p className="text-muted-foreground">
          Choose a date for your appointment
        </p>
      </div>
      <DatePicker />
    </div>
  );
}
