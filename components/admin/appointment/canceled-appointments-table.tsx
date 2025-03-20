"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CanceledAppointment {
  id: string;
  phoneNumber: string;
  appointmentDate: string;
  canceledAt: string;
  reason: string | null;
}

export default function CanceledAppointmentsTable() {
  const [canceledAppointments, setCanceledAppointments] = useState<
    CanceledAppointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCanceledAppointments();
  }, []);

  const fetchCanceledAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/canceled-appointments");

      if (!response.ok) {
        throw new Error("Failed to fetch canceled appointments");
      }

      const data = await response.json();
      setCanceledAppointments(data);
    } catch (error) {
      toast.error("Failed to load canceled appointments");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canceled Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : canceledAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No canceled appointments found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Appointment Date</TableHead>
                <TableHead>Canceled At</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {canceledAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.phoneNumber}</TableCell>
                  <TableCell>
                    {formatDate(new Date(appointment.appointmentDate))}
                  </TableCell>
                  <TableCell>
                    {formatDate(new Date(appointment.canceledAt))}
                  </TableCell>
                  <TableCell>
                    {appointment.reason || "No reason provided"}
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
