"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export const SignupButton = () => {
  const path = usePathname();
  return (
    <Link href={`/auth${path !== "/" ? `?redirect=${path}` : ""}`} passHref>
      <Button
        variant="default"
        className="hidden md:inline-flex bg-btnblue text-white rounded-[12px] p-[12px_20px] py-5"
      >
        Sign up / Log in
      </Button>
    </Link>
  );
};

export const SignupButton1 = () => {
  const path = usePathname();
  return (
    <Link href={`/auth${path !== "/" ? `?redirect=${path}` : ""}`} passHref>
      <img
        src="/user.png"
        alt="User Profile"
        className="h-10 w-10 rounded-full object-cover md:hidden"
      />
    </Link>
  );
};
