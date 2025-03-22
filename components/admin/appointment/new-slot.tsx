"use client";
import React, { useState } from "react";
import Pagination from "../pagination";
import SearchInput from "@/components/others/SearchInput";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { TimeSlot } from "@prisma/client";
import { useRouter } from "next/navigation";
import ExcelImportExport from "./excel-import-export";
import TimeSlotForm from "./time-slot-form";
import QuestionActions from "../actions/questions";
import TimeSlotsActions from "../actions/time-slots";
import CleartButton from "./clear-button";

const NewSLot = ({
  timeSlots,
  search,
  searchParams,
  totalPages,
  totalTimeSlots,
}: {
  timeSlots: TimeSlot[];
  search: string;
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
  };
  totalPages: number;
  totalTimeSlots: number;
}) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTimeSlot(null);
    router.refresh();
  };

  const handleImportExportSuccess = () => {
    setShowImportExport(false);
    router.refresh();
  };

  const toggleImportExport = () => {
    setShowImportExport(!showImportExport);
    setShowForm(false);
    setEditingTimeSlot(null);
  };

  const handleEditTimeSlot = (timeSlot: { data: TimeSlot }) => {
    setEditingTimeSlot(timeSlot?.data);
    setShowForm(true);
    setShowImportExport(false);
  };

  return (
    <>
      {showForm ? (
        <TimeSlotForm
          onSuccess={handleFormSuccess}
          initialData={editingTimeSlot ? editingTimeSlot : undefined}
        />
      ) : showImportExport ? (
        <ExcelImportExport
          onImportSuccess={handleImportExportSuccess}
          setShowImportExport={setShowImportExport}
        />
      ) : (
        <main className="container mx-auto py-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Time Slots</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <SearchInput defaultValue={search} type="date" />
              <CleartButton search={search} />
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <Button variant="outline" onClick={toggleImportExport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import/Export
              </Button>
              <Link href="/admin/slots/new">
                <Button className="bg-btnblue hover:bg-btnblue/80 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Time Slot
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[0.8fr_1.5fr_0.5fr_0.5fr_0.5fr_auto] gap-4 p-4 bg-btnblue text-white rounded-t-lg text-left">
                <div>Date</div>
                <div>Time</div>
                <div>Seats</div>
                <div>Price</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="divide-y">
                {timeSlots.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No time slots found
                  </div>
                ) : (
                  timeSlots.map((timeSlot) => (
                    <div
                      key={timeSlot.id}
                      className="grid grid-cols-[0.8fr_1.5fr_0.5fr_0.5fr_0.5fr_auto] gap-4 p-4 hover:bg-gray-50 text-left"
                    >
                      <div>{format(new Date(timeSlot.date), "dd/MM/yyyy")}</div>
                      <div>
                        {format(new Date(timeSlot.startTime), "hh:mm a")} -{" "}
                        {format(new Date(timeSlot.endTime), "hh:mm a")}
                      </div>
                      <div>
                        {timeSlot.bookedSeats} / {timeSlot.totalSeats}
                      </div>
                      <div>{formatCurrency(timeSlot.price)}</div>
                      <div
                        className={
                          timeSlot.isActive ? "text-green-500" : "text-red-500"
                        }
                      >
                        {timeSlot.isActive ? "Active" : "Inactive"}
                      </div>
                      <div className="flex items-left justify-left ">
                        <TimeSlotsActions
                          timeslot={{
                            data: timeSlot,
                            handleEditTimeSlot: handleEditTimeSlot,
                          }}
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
            total={totalTimeSlots}
            totalPages={totalPages}
          />
        </main>
      )}
    </>
  );
};

export default NewSLot;
