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
import { Download, ToggleLeft, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

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
          const json = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          json.forEach((row: any) => {
            if (row.date && typeof row.date === "number") {
              const parsedDate = XLSX.SSF.parse_date_code(row.date);
              row.date = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d)
                .toISOString()
                .split("T")[0];
            }
          });

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
    ];

    for (const column of requiredColumns) {
      if (!(column in firstRow)) {
        throw new Error(`Missing required column: ${column}`);
      }
    }
  };

  const processBatch = async (batch: any[]) => {
    const formattedBatch = batch.map((row) => ({
      date: new Date(row.date).toISOString().split("T")[0],
      startTime: new Date(row.startTime).toISOString(),
      endTime: new Date(row.endTime).toISOString(),
      totalSeats: Number.parseInt(row.totalSeats),
      price: Number.parseFloat(row.price),
      isActive: row.isActive !== undefined ? row.isActive : true,
    }));

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
    setIsExporting(true);

    try {
      // Fetch all time slots
      const response = await fetch("/api/admin/time-slots");

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const timeSlots = await response.json();

      const excelData = timeSlots.map((slot: any) => ({
        date: new Date(slot.date).toISOString().split("T")[0],
        startTime: new Date(slot.startTime).toISOString(),
        endTime: new Date(slot.endTime).toISOString(),
        totalSeats: slot.totalSeats,
        bookedSeats: slot.bookedSeats,
        price: slot.price,
        isActive: slot.isActive ?? true,
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
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
              className="w-full bg-btnblue  text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Time Slots to Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
