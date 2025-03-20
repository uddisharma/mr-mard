"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Loader2, Plus, FileSpreadsheet } from "lucide-react";
import TimeSlotForm from "./time-slot-form";
import ExcelImportExport from "./excel-import-export";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  isActive: boolean;
}

export default function TimeSlotsTable() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/time-slots");

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      toast.error("Failed to load time slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTimeSlot = (timeSlot: TimeSlot) => {
    setEditingTimeSlot(timeSlot);
    setShowForm(true);
    setShowImportExport(false);
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/time-slots/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete time slot");
      }

      toast.success("The time slot has been deleted successfully");

      // Refresh time slots list
      fetchTimeSlots();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete time slot",
      );
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTimeSlot(null);
    fetchTimeSlots();
  };

  const handleImportExportSuccess = () => {
    setShowImportExport(false);
    fetchTimeSlots();
  };

  const toggleImportExport = () => {
    setShowImportExport(!showImportExport);
    setShowForm(false);
    setEditingTimeSlot(null);
  };

  return (
    <>
      {showForm ? (
        <TimeSlotForm
          onSuccess={handleFormSuccess}
          initialData={editingTimeSlot || undefined}
        />
      ) : showImportExport ? (
        <ExcelImportExport onImportSuccess={handleImportExportSuccess} />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Time Slots</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={toggleImportExport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import/Export
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Time Slot
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No time slots found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((timeSlot) => (
                    <TableRow key={timeSlot.id}>
                      <TableCell>
                        {formatDate(new Date(timeSlot.date))}
                      </TableCell>
                      <TableCell>
                        {formatTime(new Date(timeSlot.startTime))} -{" "}
                        {formatTime(new Date(timeSlot.endTime))}
                      </TableCell>
                      <TableCell>
                        {timeSlot.bookedSeats} / {timeSlot.totalSeats}
                      </TableCell>
                      <TableCell>{formatCurrency(timeSlot.price)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            timeSlot.isActive
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {timeSlot.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTimeSlot(timeSlot)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
