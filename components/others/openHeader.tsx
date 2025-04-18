import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const OpenHeader = () => {
  return (
    <header className="py-5">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="  text-xl">
          Milele Health
        </Link>
      </div>
    </header>
  );
};

export default OpenHeader;
