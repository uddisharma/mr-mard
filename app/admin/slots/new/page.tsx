"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface TimeSlotFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    totalSeats: number;
    price: number;
    isActive: boolean;
  };
}

export default function TimeSlotForm({
  onSuccess,
  initialData,
}: TimeSlotFormProps) {
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : "",
  );
  const [startTime, setStartTime] = useState(
    initialData?.startTime
      ? new Date(initialData.startTime).toISOString().slice(0, 16)
      : "",
  );
  const [endTime, setEndTime] = useState(
    initialData?.endTime
      ? new Date(initialData.endTime).toISOString().slice(0, 16)
      : "",
  );
  const [totalSeats, setTotalSeats] = useState(
    initialData?.totalSeats?.toString() || "",
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || "50.00");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !totalSeats || !price) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isEditing
        ? `/api/admin/time-slots/${initialData.id}`
        : "/api/admin/time-slots";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          startTime,
          endTime,
          totalSeats: Number.parseInt(totalSeats),
          price: Number.parseFloat(price),
          isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save time slot");
      }

      toast.success(
        isEditing
          ? "The time slot has been updated successfully"
          : "A new time slot has been created",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save time slot",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 ">
      <h1 className="text-2xl font-semibold mb-6">Add New Slot</h1>
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border-[1px] border-whiteGray">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Time Slot" : "Create New Time Slot"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total-seats">Total Seats</Label>
                <Input
                  id="total-seats"
                  type="number"
                  min="1"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
