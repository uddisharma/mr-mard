"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ExportType } from "@/schemas/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

const ExportButton = ({ type }: { type: ExportType }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleDownloadAndExport = async () => {
    if (!dateRange.from || !dateRange.to) return;
    try {
      setLoading(true);
      const data = await fetch(
        `/api/export/${type}?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`,
      );
      const resData = await data.json();
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        quoteStrings: false,
        decimalSeparator: ".",
        showTitle: true,
        title: `${type}s`,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      });

      if (type == "report") {
        const formattedData = resData.map((e: any) => ({
          ...e,
          questions: e.questions
            .map((q: any) => `${q.question}: ${q.answer}`)
            .join(", "),
          recommendation: e.recommendation?.message,
          startTime: e.startTime?.split("T")[0],
          endTime: e.endTime?.split("T")[0],
          createdAt: e.createdAt?.split("T")[0],
          updatedAt: e.updatedAt?.split("T")[0],
        }));
        const csv = generateCsv(csvConfig)(formattedData);
        return download(csvConfig)(csv);
      }

      const formattedBlogs = resData.map((e: any) => ({
        ...e,
        createdAt: e.createdAt?.split("T")[0],
        updatedAt: e.updatedAt?.split("T")[0],
      }));
      const csv = generateCsv(csvConfig)(formattedBlogs);
      download(csvConfig)(csv);
      setDateRange({ from: undefined, to: undefined });
    } catch (error) {
      console.log(error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
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
              "Select date range to export"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
              onClick={handleDownloadAndExport}
              disabled={!dateRange.from || !dateRange.to}
            >
              {loading ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExportButton;
