"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
  defaultValue?: string;
  type?: string;
}

export default function SearchInput({ type = "text" }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", e.target.value);
    searchParams.set("page", "1");
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <Input
      placeholder="Search items..."
      value={searchParams.get("search") || ""}
      type={type}
      onChange={handleSearchChange}
    />
  );
}
