"use client";

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
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/utils";

export default function AppointmentsList({
  appointments,
}: {
  appointments: any;
}) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">My Appointments</CardTitle>
        <Link href="/appointment-booking">
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium md:table-cell">
                  Scheduled Date
                </TableHead>
                <TableHead className="font-medium md:table-cell">
                  Scheduled Time
                </TableHead>
                <TableHead className="font-medium md:table-cell">
                  Payment ID
                </TableHead>
                <TableHead className="font-medium md:table-cell">
                  Payment Method
                </TableHead>
                <TableHead className="font-medium md:table-cell">
                  Booking Status
                </TableHead>
                <TableHead className="font-medium md:table-cell">
                  Payment Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.map((appointment: any) => (
                <TableRow key={appointment.id}>
                  <TableCell className="md:table-cell">
                    {new Date(appointment.timeSlot.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    {formatTime(new Date(appointment.timeSlot.startTime))}-{" "}
                    {formatTime(new Date(appointment.timeSlot.endTime))}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    {appointment?.transaction?.transactionId || "N/A"}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    {appointment?.transaction?.paymentMethod || "N/A"}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    <Badge
                      variant={`${
                        appointment.status === "CONFIRMED"
                          ? "sucess"
                          : "destructive"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="md:table-cell">
                    <Badge
                      variant={`${
                        appointment?.transaction?.status === "COMPLETED"
                          ? "sucess"
                          : "destructive"
                      }`}
                    >
                      {appointment?.transaction?.status
                        ? appointment.transaction.status
                            .charAt(0)
                            .toUpperCase() +
                          appointment.transaction.status.slice(1).toLowerCase()
                        : "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
