"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeInfo, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AppointmentStatus } from "@prisma/client";

interface AppointmentActionsProps {
  appointment: {
    id: string;
    phone: string;
    status: AppointmentStatus;
  };
}

export default function AppointmentActions({
  appointment,
}: AppointmentActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  const status =
    appointment.status == AppointmentStatus.CANCELLED ? "confirm" : "cancel";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/appointments/${appointment?.id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        router.refresh();
        toast.success("Appointment deleted successfully");
      } else if (response.status == 403) {
        toast.error("You don't have permission to delete an appointment");
      } else {
        toast.error("Appointment failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete appointment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(
        `/api/admin/appointments/${appointment?.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status:
              appointment.status == AppointmentStatus.CANCELLED
                ? AppointmentStatus.CONFIRMED
                : AppointmentStatus.CANCELLED,
          }),
        },
      );
      if (response.ok) {
        router.refresh();
        toast.success(
          `Appointment ${status == "cancel" ? "cancelled" : "confirmed"} successfully`,
        );
      } else if (response.status == 403) {
        toast.error(`You don't have permission to ${status} an appointment`);
      } else {
        toast.error(`Appointment failed to ${status}`);
      }
    } catch (error) {
      toast.error(`Failed to ${status} appointment. Please try again.`);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <BadgeInfo className="mr-2 h-4 w-4 cursor-pointer" />
              {isCancelling
                ? `${status == "cancel" ? "Cancelling" : "Confirming"}...`
                : status == "cancel"
                  ? "Cancel"
                  : "Confirm"}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently {status} the
                appointment booked by "{appointment?.phone}"
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Cancel"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4 cursor-pointer" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                appointment booked by "{appointment?.phone}" and remove it from
                our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
