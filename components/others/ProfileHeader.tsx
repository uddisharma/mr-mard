import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "@/components/others/Logout";
import Link from "next/link";

const ProfileHeader = ({ user }: { user: any }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div>
      <div className="mb-5 md:mb-8 flex flex-wrap md:flex-nowrap items-center w-full justify-between gap-4">
        <div className="flex md:flex-row justify-between items-start md:items-center gap-4 w-full mb-2 md:mb-0">
          <div className="md:w-auto md:mb-0">
            <h2 className="text-2xl font-medium text-gray-800">
              Welcome, {user?.name}
            </h2>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>

          <div className="flex md:hidden items-center gap-4">
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button> */}
            <Logout image={user?.image || "/user.png"} hidden={false} />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* <div className="relative w-full md:w-[300px]">
            <Input
              type="search"
              placeholder="Search"
              className="w-full h-[45px] md:h-[35px] bg-btnblue text-white pl-10 rounded-md border-none "
            />
            <svg
              className="absolute left-3 top-3 md:top-2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div> */}

          <Link href="/contact-us">
            <div className="flex items-center justify-center w-[250px] h-[45px] md:h-[35px] bg-btnblue text-white text-center rounded-md border-none">
              Need Help?
            </div>
          </Link>

          <Button className="hidden md:flex" variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Logout
            image={user?.image || "/user.png"}
            name={user?.name}
            email={user?.email}
            hidden={true}
          />
        </div>
      </div>
      <div className="mb-4 md:mb-8 rounded-lg bg-[#F6E05E] p-5 md:p-6"></div>
    </div>
  );
};

export default ProfileHeader;
