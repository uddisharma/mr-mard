"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Logout = ({
  image,
  name,
  email,
  hidden,
}: {
  image?: string;
  name?: string;
  email?: string;
  hidden?: boolean;
}) => {
  const pathName = usePathname();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`${hidden ? "hidden" : "flex"} md:flex items-center cursor-pointer w-10 h-10 md:w-[40px] md:h-[38px]`}
        >
          <Image
            src={image || "/user.png"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-[12px] w-10 h-10 md:w-[40px] md:h-[40px]"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 mt-3 mr-5 md:mt-0 md:mr-6 rounded-lg shadow-md border border-gray-200 bg-white">
        {/* <div className="flex items-center gap-4">
          <Image
            src={image || "/user.png"}
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full w-[50px] h-[50px]"
          />
          <div>
            <p className="font-bold text-md text-gray-900">{name || "Guest"}</p>
            <p className="text-sm text-gray-500">
              {email ? email.split("@")[0] : ""}
            </p>
          </div>
        </div> */}
        <div className="mt-0 space-y-4">
          {pathName.startsWith("/profile") && (
            <Link
              href="/"
              className="block text-gray-800 text-sm font-medium hover:text-gray-900"
            >
              Home
            </Link>
          )}
          <Link
            href="/profile"
            className="block text-gray-800 text-sm font-medium hover:text-gray-900"
          >
            My Profile
          </Link>
          <Link
            href="/profile/my-reports"
            className="block text-gray-800 text-sm font-medium hover:text-gray-900"
          >
            My Reports
          </Link>
          <Link
            href="/profile/my-appointments"
            className="block text-gray-800 text-sm font-medium hover:text-gray-900"
          >
            My Appointments
          </Link>
          <p
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block text-gray-800 text-sm font-medium cursor-pointer hover:text-gray-900"
          >
            Logout
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Logout;
