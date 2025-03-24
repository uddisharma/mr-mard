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
import { ToggleLeft } from "lucide-react";

interface TimeSlotFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    totalSeats: number;
    price: number;
    originalPrice: number;
    label?: string;
    isActive: boolean;
  };
}

export default function TimeSlotForm({
  onSuccess,
  initialData,
}: TimeSlotFormProps) {
  console.log(initialData);
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
  const [OriginalPrice, setOriginalPrice] = useState(
    initialData?.originalPrice?.toString() || "600",
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || "500");
  const [label, setLabel] = useState(initialData?.label || "");
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

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save time slot",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Time Slots</h2>
        </div>
        <Button onClick={onSuccess} variant="outline">
          <ToggleLeft className="mr-2 h-4 w-4" />
          Close
        </Button>
      </div>
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
              <Label htmlFor="o_price">Original Price</Label>
              <Input
                id="o_price"
                type="number"
                min="0"
                step="0.01"
                value={OriginalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="lable"
                type="string"
                min="0"
                step="0.01"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
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
    </main>
  );
}
