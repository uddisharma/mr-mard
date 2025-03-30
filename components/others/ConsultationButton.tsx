"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ConsultationButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      {showButton && (
        <Link href="/appointment-booking">
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-20 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition duration-300">
            Book Consultation
          </div>
        </Link>
      )}
    </>
  );
};

export default ConsultationButton;
