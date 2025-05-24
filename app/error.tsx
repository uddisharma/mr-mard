"use client";
import { RotateCcw } from "lucide-react";
import React from "react";

export const metadata = {
  title: "Internal Server Error",
  description: "Internal Server Error",
};

const Error = () => {
  const Retry = () => {
    window.location.reload();
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 p-4">
      <h1 className="text-9xl font-bold text-btnblue ">500</h1>
      <h2 className="text-3xl font-semibold mt-4">Internal Server Error</h2>
      <p className="text-lg text-gray-500 mt-2 mb-6">
        Oops! Something went wrong.
      </p>
      <div
        onClick={Retry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-btnblue text-white rounded-full hover:bg-gray-800 transition"
      >
        <RotateCcw size={20} />
        Try again
      </div>
    </div>
  );
};

export default Error;
