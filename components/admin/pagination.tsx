"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
  };
  total: number;
  totalPages: number;
};

export default function Pagination({
  searchParams,
  total,
  totalPages,
}: PageProps) {
  const router = useRouter();
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const path = usePathname();
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  const handlePageChange = (newPage: number) => {
    router.push(
      `${path}?page=${newPage}&limit=${limit}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`,
    );
  };

  const handleLimitChange = (newLimit: string) => {
    router.push(
      `${path}?page=1&limit=${newLimit}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`,
    );
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8 bg-white",
              page === i && "bg-btnblue text-white",
            )}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>,
        );
      }
    } else {
      buttons.push(
        <Button
          key={1}
          variant={page === 1 ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-8 w-8 bg-white",
            page === 1 && "bg-btnblue text-white",
          )}
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>,
      );

      if (page > 3) {
        buttons.push(
          <Button
            key="ellipsis1"
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            disabled
          >
            ...
          </Button>,
        );
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        buttons.push(
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-8 w-8 bg-white",
              page === i && "bg-btnblue text-white",
            )}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>,
        );
      }

      if (page < totalPages - 2) {
        buttons.push(
          <Button
            key="ellipsis2"
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            disabled
          >
            ...
          </Button>,
        );
      }

      buttons.push(
        <Button
          key={totalPages}
          variant={page === totalPages ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-8 w-8 bg-white",
            page === totalPages && "bg-btnblue text-white",
          )}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {renderPageButtons()}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-white">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
