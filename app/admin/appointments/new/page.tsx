"use client";
import NewAppointmentPage from "@/components/admin/appointment/new";

export default function SettingsPage() {
  return (
    <main className="p-4 sm:p-6 ">
      <h1 className="text-2xl font-semibold mb-6">Create New Appointment</h1>
      <div className="bg-white rounded-xl sm:p-6 shadow-sm border-[1px] border-whiteGray">
        <NewAppointmentPage />
      </div>
    </main>
  );
}
