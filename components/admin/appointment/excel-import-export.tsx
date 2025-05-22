"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Download, ToggleLeft, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { cn, formatTime } from "@/lib/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export default function ExcelImportExport({
  onImportSuccess,
  setShowImportExport,
}: {
  onImportSuccess: () => void;
  setShowImportExport: (show: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select an Excel file to import");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const data = await readExcelFile(file);

      if (!data || data.length === 0) {
        throw new Error("No data found in the Excel file");
      }

      validateExcelData(data);

      const batches = [];
      for (let i = 0; i < data.length; i += 30) {
        batches.push(data.slice(i, i + 30));
      }

      let processedCount = 0;

      for (const batch of batches) {
        await processBatch(batch);
        processedCount += batch.length;
        setProgress(Math.floor((processedCount / data.length) * 100));
      }

      toast.success(`Successfully imported ${data.length} time slots`);

      onImportSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import Excel data",
      );
    } finally {
      setIsUploading(false);
      setFile(null);
      const fileInput = document.getElementById(
        "excel-file",
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });

          resolve(json);
        } catch (error) {
          reject(new Error("Failed to parse Excel file"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read Excel file"));
      };

      reader.readAsBinaryString(file);
    });
  };

  const validateExcelData = (data: any[]) => {
    const firstRow = data[0];
    const requiredColumns = [
      "date",
      "startTime",
      "endTime",
      "totalSeats",
      "price",
      "originalPrice",
      "isActive",
    ];

    for (const column of requiredColumns) {
      if (!(column in firstRow)) {
        throw new Error(`Missing required column: ${column}`);
      }
    }
  };

  const processBatch = async (batch: any[]) => {
    const formattedBatch = batch.map((row) => {
      const dateStr = dayjs(row.date).format("YYYY-MM-DD");

      const rawStart = row.startTime?.trim().replace(/\s+/g, "").toUpperCase();
      const rawEnd = row.endTime?.trim().replace(/\s+/g, "").toUpperCase();

      const startStr = `${dateStr} ${rawStart}`;
      const endStr = `${dateStr} ${rawEnd}`;

      let parsedStart = dayjs.tz(startStr, "YYYY-MM-DDhh:mma", "Asia/Kolkata");
      let parsedEnd = dayjs.tz(endStr, "YYYY-MM-DDhh:mma", "Asia/Kolkata");

      const isStartPM = rawStart.includes("PM");
      const isEndPM = rawEnd.includes("PM");

      if (isStartPM && parsedStart.hour() < 12) {
        parsedStart = parsedStart.add(12, "hour");
      }
      if (isEndPM && parsedEnd.hour() < 12) {
        parsedEnd = parsedEnd.add(12, "hour");
      }

      const formattedStart = parsedStart.format("YYYY-MM-DDTHH:mm");
      const formattedEnd = parsedEnd.format("YYYY-MM-DDTHH:mm");

      return {
        date: row.date,
        startTime: dayjs.tz(formattedStart, "UTC").toISOString(),
        endTime: dayjs.tz(formattedEnd, "UTC").toISOString(),
        totalSeats: Number(row.totalSeats),
        price: Number(row.price),
        originalPrice: Number(row.originalPrice),
        label: row.label || "",
        isActive:
          row.isActive === "true" ||
          row.isActive == "TRUE" ||
          row.isActive === true,
      };
    });

    const response = await fetch("/api/admin/time-slots/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timeSlots: formattedBatch }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to import batch");
    }

    return response.json();
  };

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) return;

    setIsExporting(true);

    try {
      const response = await fetch(
        `/api/admin/time-slots?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const timeSlots = await response.json();

      const excelData = timeSlots.map((slot: any) => ({
        date: new Date(slot.date).toISOString().split("T")[0],
        startTime: formatTime(slot.startTime)?.replaceAll(" ", "").trim(),
        endTime: formatTime(slot.endTime)?.replaceAll(" ", "").trim(),
        totalSeats: slot.totalSeats,
        // bookedSeats: slot.bookedSeats,
        price: slot.price,
        originalPrice: slot.originalPrice,
        label: slot.label,
        isActive: slot.isActive ? "true" : "false",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TimeSlots");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `time-slots-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${timeSlots.length} time slots`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export time slots",
      );
    } finally {
      setIsExporting(false);
      setShowImportExport(false);
    }
  };

  const handleDelete = async () => {
    if (!dateRange.from || !dateRange.to) return;

    const updatedTo = new Date(dateRange.to);
    updatedTo.setDate(updatedTo.getDate() + 1);

    const updatedFrom = new Date(dateRange.from);
    updatedFrom.setDate(updatedFrom.getDate() + 1);

    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/admin/time-slots?from=${updatedFrom.toISOString()}&to=${updatedTo.toISOString()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(` API failed with status ${res.status}`);
      }

      if (data.success) {
        if (data?.data?.count === 0) {
          toast.error("No time slots found to delete in the selected range");
        } else {
          toast.success(`${data?.data?.count} time slots deleted successfully`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowImportExport(false);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Time Slots</h2>
        </div>
        <Button onClick={() => setShowImportExport(false)} variant="outline">
          <ToggleLeft className="mr-2 h-4 w-4" />
          Close
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Time Slots</CardTitle>
          <CardDescription>
            Import time slots from Excel or export existing time slots to Excel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excel-file">Import Excel File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button
                onClick={handleImport}
                disabled={!file || isUploading}
                className="whitespace-nowrap"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Excel file must contain columns: date, startTime, endTime,
              totalSeats, price
            </p>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Label>Import Progress</Label>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {progress}%
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex flex-col items-center space-y-4">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !dateRange.from && "text-white bg-btnblue",
                    )}
                  >
                    <CalendarIcon className=" h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Select date range to export and delete"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 mr-14" align="start">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Select date range</h3>
                  </div>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    //@ts-ignore
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    defaultMonth={new Date()}
                    initialFocus
                  />
                  <div className="flex items-center justify-end gap-2 p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting || !dateRange.from || !dateRange.to}
                    >
                      {isExporting ? "Deleting..." : "Delete Data"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExport}
                      disabled={isExporting || !dateRange.from || !dateRange.to}
                    >
                      {isExporting ? "Exporting..." : "Export Data"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
