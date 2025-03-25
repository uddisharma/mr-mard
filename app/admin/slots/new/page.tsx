"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function TimeSlotForm({}) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalSeats, setTotalSeats] = useState("5");
  const [OriginalPrice, setOriginalPrice] = useState("600");
  const [price, setPrice] = useState("500");
  const [label, setLabel] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !totalSeats || !price) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = "/api/admin/time-slots";

      const method = "POST";

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
          OriginalPrice: Number.parseFloat(OriginalPrice),
          label,
          isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save time slot");
      }
      revalidatePath("/admin/slots");
      router.push("/admin/slots");
      toast.success("A new time slot has been created");
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
            <CardTitle>Create New Time Slot</CardTitle>
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
                <Label htmlFor="price">Discounted Price</Label>
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
                <Label htmlFor="label">Label ( Optional )</Label>
                <Input
                  id="label"
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
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
