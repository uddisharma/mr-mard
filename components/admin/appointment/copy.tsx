"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CopyInput({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          type="text"
          value={value}
          readOnly
          className="pr-16 h-10 border-2 focus-visible:ring-offset-2 "
        />
        <Button
          onClick={handleCopy}
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0"
          variant="default"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy</span>
        </Button>
      </div>
    </div>
  );
}
