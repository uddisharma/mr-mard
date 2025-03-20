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
import { formatDate, formatTime } from "@/lib/utils";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Appointment {
  id: string;
  user: {
    phoneNumber: string;
  };
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  transaction: {
    amount: number;
    status: string;
  };
  status: string;
  createdAt: string;
}

export default function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredAppointments(
        appointments.filter(
          (appointment) =>
            appointment.user.phoneNumber.includes(query) ||
            appointment.id.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, appointments]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/appointments");

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          reason: "Canceled by admin",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      toast.error("The appointment has been canceled successfully");

      // Refresh appointments list
      fetchAppointments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel appointment",
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appointments</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by phone or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No appointments found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>{appointment.user.phoneNumber}</TableCell>
                  <TableCell>
                    {formatDate(new Date(appointment.timeSlot.date))}
                  </TableCell>
                  <TableCell>
                    {formatTime(new Date(appointment.timeSlot.startTime))} -{" "}
                    {formatTime(new Date(appointment.timeSlot.endTime))}
                  </TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    <span
                      className={
                        appointment.transaction.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-amber-600"
                      }
                    >
                      {appointment.transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
