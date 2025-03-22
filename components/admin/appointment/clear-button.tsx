"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const CleartButton = ({ search }: { search?: string }) => {
  const router = useRouter();
  const path = usePathname();
  return (
    <div>
      {search && (
        <Button
          variant="outline"
          onClick={() => {
            router.push(path);
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default CleartButton;
