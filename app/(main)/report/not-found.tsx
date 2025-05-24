import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Not Found",
  description: "Not Found",
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 p-4">
      <h1 className="text-9xl font-bold text-btnblue mt-[-100px]">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Report Not Found</h2>
      <p className="text-lg text-gray-500 mt-2 mb-6">
        Oops! The report you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-btnblue text-white rounded-full hover:bg-gray-800 transition"
      >
        <ArrowLeft size={20} />
        Go back Home
      </Link>
    </div>
  );
};

export default NotFound;
