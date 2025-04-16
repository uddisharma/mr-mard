import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const AuthHeader = () => {
  return (
    <header className="py-5">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold">
          <Image
            src="/m_logo1.png"
            alt="Milele Health"
            className="m-auto"
            width={120}
            height={50}
          />
        </Link>
        <Button
          variant="default"
          className="bg-btnblue text-white rounded-[12px] p-[12px_20px]"
        >
          Sign up / Log in
        </Button>
      </div>
    </header>
  );
};

export default AuthHeader;
